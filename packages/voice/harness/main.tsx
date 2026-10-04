import { createRoot } from "react-dom/client";
import { TeachBackInput } from "../src";

// Drug names as the engine would extract them from the letter.
const LETTER_DRUGS = ["furosemide", "bisoprolol"];

createRoot(document.getElementById("root")!).render(
  <TeachBackInput
    letterDrugs={LETTER_DRUGS}
    onSubmit={(r) => {
      document.getElementById("out")!.textContent = JSON.stringify(r);
    }}
  />,
);
