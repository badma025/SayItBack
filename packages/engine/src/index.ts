/**
 * Say It Back engine.
 *
 * The pipeline, in the order a discharge goes through it:
 *
 *   letter text + model slots -> verifyLetterExtraction  (quotes must be real)
 *   transcript + model slots  -> gradeTeachBack          (rules decide)
 *                             -> reteachPlan             (quote only)
 *
 * No function here calls a model or the network. Models are upstream; they fill
 * slots and nothing else.
 */

export * from "./types.js";
export {
  LETTER_EXTRACTION_SCHEMA,
  TEACH_BACK_EXTRACTION_SCHEMA,
  validateLetterExtraction,
  validateTeachBackExtraction,
  type ValidationIssue,
  type ValidationResult,
} from "./schema.js";
export {
  findQuote,
  checkSlotGrounding,
  verifyLetterExtraction,
  type EvidenceOptions,
  type QuoteCheck,
  type SlotGrounding,
  type VerifyOptions,
} from "./evidence.js";
export {
  compareItem,
  pairItems,
  pairingScore,
  lettersDrugScope,
  type ComparatorOptions,
  type Pairing,
  type PairingResult,
} from "./comparator.js";
export {
  askTheWardFor,
  falseConfirmCount,
  gradeSlots,
  gradeTeachBack,
  outstandingItemIds,
  reteachPlan,
  type GradeOptions,
  type ReteachStep,
} from "./grading.js";
export {
  DRUG_DICTIONARY,
  biasVocabulary,
  findDrugTerms,
  layNamesFor,
  resolveDrug,
  type DrugEntry,
  type DrugResolution,
} from "./lay-names.js";
export {
  formatContact,
  formatDirection,
  formatDose,
  formatFrequency,
  formatTimeframe,
  parseContact,
  parseDirection,
  parseDose,
  parseDoses,
  parseFrequency,
  parseNumber,
  parseTimeframeDays,
  sameDose,
  type ParsedDose,
} from "./parse.js";
export {
  PHRASE_SYNONYMS,
  comparePhrase,
  contentWords,
  type PhraseComparison,
  type PhraseOptions,
} from "./phrases.js";
export { digitRuns, editDistance, normalise, similarity } from "./text.js";
