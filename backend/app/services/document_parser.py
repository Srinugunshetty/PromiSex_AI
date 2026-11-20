import re
from pathlib import Path
from typing import Dict, List, Optional
import pypdf

class DocumentParser:
    @staticmethod
    def extract_text_from_file(file_path: Path) -> str:
        suffix = file_path.suffix.lower()
        if suffix in [".txt", ".md", ".json", ".csv"]:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        elif suffix == ".pdf":
            try:
                reader = pypdf.PdfReader(str(file_path))
                text = ""
                for idx, page in enumerate(reader.pages):
                    extracted = page.extract_text()
                    if extracted:
                        text += f"\n--- Page {idx + 1} ---\n" + extracted
                return text
            except Exception as e:
                print(f"[DocumentParser] PDF read error: {e}")
                return ""
        return ""

    @staticmethod
    def parse_sections(text: str) -> Dict[str, str]:
        """Splits raw specification or policy documents into titled chunks/sections."""
        sections: Dict[str, str] = {}
        current_section = "General Overview"
        lines = text.splitlines()

        for line in lines:
            trimmed = line.strip()
            # Detect section header like "## Battery", "1. Battery", "WARRANTY POLICY:", "Specifications:"
            match = re.match(r'^(?:#{1,3}\s*|\d+[\.\)]\s*|[A-Z\s]{4,}:)\s*(.+)$', trimmed)
            if match and len(trimmed) < 60 and not trimmed.endswith('.'):
                current_section = match.group(1).strip()
                if current_section not in sections:
                    sections[current_section] = ""
            else:
                sections[current_section] = sections.get(current_section, "") + "\n" + line

        return {k: v.strip() for k, v in sections.items() if v.strip()}

doc_parser = DocumentParser()
