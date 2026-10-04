#!/usr/bin/env python3
"""
Verify Integrity of the Frozen Teach-Back Evaluation Dataset.
Checks cryptographic SHA-256 hashes against FROZEN_MANIFEST.json,
validates schema consistency, checks perturbation distributions,
and recalculates inter-rater reliability (Cohen's Kappa).
"""

import sys
import json
import hashlib
from pathlib import Path
from sklearn.metrics import cohen_kappa_score

REPO_ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = REPO_ROOT / "data" / "eval" / "FROZEN_MANIFEST.json"
DATASET_PATH = REPO_ROOT / "data" / "eval" / "teach_back_gold_dataset.json"

def verify():
    print("=" * 70)
    print("SAY IT BACK - EVALUATION DATASET INTEGRITY & FREEZE VERIFICATION")
    print("=" * 70)

    if not MANIFEST_PATH.exists():
        print(f"FAIL: Manifest not found at {MANIFEST_PATH}")
        sys.exit(1)

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    print(f"Dataset Name: {manifest['dataset_name']}")
    print(f"Status:       {manifest['status']}")
    print(f"Freeze Date:  {manifest['freeze_timestamp']}")
    print(f"Total Items:  {manifest['total_items']}")
    print("-" * 70)

    # 1. Verify File Hashes
    print("1. Verifying Cryptographic Hashes (SHA-256):")
    all_matched = True
    for rel_path, expected_hash in manifest["file_hashes"].items():
        file_path = REPO_ROOT / rel_path
        if not file_path.exists():
            print(f"  [MISSING] {rel_path}")
            all_matched = False
            continue

        actual_hash = hashlib.sha256(file_path.read_bytes()).hexdigest()
        if actual_hash == expected_hash:
            print(f"  [PASS] {rel_path} -> {actual_hash[:12]}...")
        else:
            print(f"  [FAIL] {rel_path} HASH MISMATCH!")
            print(f"         Expected: {expected_hash}")
            print(f"         Actual:   {actual_hash}")
            all_matched = False

    if not all_matched:
        print("\nERROR: Integrity check failed! Dataset files were modified after freeze.")
        sys.exit(1)

    print("\nAll files verified tamper-free.")

    # 2. Verify Dataset Items & Schema
    print("-" * 70)
    print("2. Verifying Dataset Schema & Consistency:")
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        items = json.load(f)

    assert len(items) == manifest["total_items"], "Item count mismatch with manifest"

    required_keys = [
        "id", "letter_id", "speaker", "target_item", "perturbation_type",
        "base_correct_transcript", "perturbed_transcript", "expected_slots",
        "extracted_slots_ground_truth", "verbatim_evidence_spans",
        "labeller_1_grade", "labeller_1_rationale",
        "labeller_2_grade", "labeller_2_rationale",
        "consensus_gold_grade", "is_safety_critical", "adversarial_challenge"
    ]

    valid_grades = {"confirmed", "missed", "misunderstood"}
    speakers = set()
    letters = set()
    perturbation_types = set()

    for idx, item in enumerate(items):
        for k in required_keys:
            if k not in item:
                raise ValueError(f"Item {item.get('id', idx)} missing required field '{k}'")

        assert item["labeller_1_grade"] in valid_grades, f"Invalid labeller_1_grade in {item['id']}"
        assert item["labeller_2_grade"] in valid_grades, f"Invalid labeller_2_grade in {item['id']}"
        assert item["consensus_gold_grade"] in valid_grades, f"Invalid consensus_gold_grade in {item['id']}"

        speakers.add(item["speaker"])
        letters.add(item["letter_id"])
        perturbation_types.add(item["perturbation_type"])

    print(f"  Item Count:          {len(items)} items")
    print(f"  Speakers:            {len(speakers)} distinct ({', '.join(sorted(speakers))})")
    print(f"  Letters:             {len(letters)} distinct ({', '.join(sorted(letters))})")
    print(f"  Perturbation Types:  {len(perturbation_types)} distinct categories")
    print(f"  Safety Critical:     {sum(1 for i in items if i['is_safety_critical'])} items")

    # 3. Recalculate Cohen's Kappa
    print("-" * 70)
    print("3. Evaluating Inter-Rater Reliability (Cohen's Kappa):")
    l1 = [i["labeller_1_grade"] for i in items]
    l2 = [i["labeller_2_grade"] for i in items]
    recalculated_kappa = cohen_kappa_score(l1, l2)
    print(f"  Calculated Cohen's Kappa (kappa): {recalculated_kappa:.4f}")
    print(f"  Manifest Stored Kappa (kappa):     {manifest['cohen_kappa_inter_rater_agreement']:.4f}")

    diff = abs(recalculated_kappa - manifest["cohen_kappa_inter_rater_agreement"])
    assert diff < 0.0001, f"Kappa mismatch: {recalculated_kappa} vs {manifest['cohen_kappa_inter_rater_agreement']}"

    print("-" * 70)
    print("4. Consensus Grade Distribution:")
    for grade, count in manifest["breakdown_by_consensus_grade"].items():
        pct = (count / len(items)) * 100
        print(f"  - {grade:<15}: {count:>2} items ({pct:>5.1f}%)")

    print("=" * 70)
    print("VERIFICATION COMPLETE: ALL DATASET FILES ARE FROZEN & VALIDATED")
    print("=" * 70)

if __name__ == "__main__":
    verify()
