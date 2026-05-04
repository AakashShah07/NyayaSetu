#!/usr/bin/env python3
"""
NyayaSetu NLP Demo — Extracts directives from a court judgment PDF.

Usage:
    cd backend/python-nlp && source .venv/bin/activate
    python ../../scripts/demo_extraction.py [path_to_pdf]

If no path is provided, uses the sample Karnataka HC judgment.
"""
import sys
import os
import json
from pathlib import Path

# Add python-nlp app to path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend" / "python-nlp"))

from app.services.ocr_service import extract_text_from_pdf
from app.services.directive_extractor import extract_directives
from app.services.legal_ner import extract_legal_metadata
from app.services.deadline_resolver import resolve_deadline


def main():
    # Determine PDF path
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
    else:
        pdf_path = str(Path(__file__).parent.parent / "data" / "sample_karnataka_hc_judgment.pdf")

    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)

    print("=" * 70)
    print("  NyayaSetu NLP Extraction Demo")
    print("=" * 70)
    print(f"\n  Input PDF: {os.path.basename(pdf_path)}")
    print(f"  File size: {os.path.getsize(pdf_path) / 1024:.1f} KB")

    # Read PDF bytes
    with open(pdf_path, "rb") as f:
        pdf_bytes = f.read()

    # Step 1: Extract text
    print("\n" + "-" * 50)
    print("  STEP 1: Text Extraction (PyPDF2 + Tesseract OCR)")
    print("-" * 50)
    extraction_result = extract_text_from_pdf(pdf_bytes)
    full_text = extraction_result.get("text", "")
    pages_data = extraction_result.get("pages_data", [])
    num_pages = extraction_result.get("pages", 0)
    method = extraction_result.get("method", "unknown")
    print(f"  Method: {method}")
    print(f"  Pages: {num_pages}")
    print(f"  Total chars: {len(full_text)}")
    if full_text:
        preview = full_text[:200].replace("\n", " ")
        print(f"  Preview: {preview}...")

    if not full_text:
        print("\n  ERROR: No text extracted. Ensure Tesseract OCR is installed.")
        sys.exit(1)

    # Step 2: Legal NER
    print("\n" + "-" * 50)
    print("  STEP 2: Legal Entity Recognition (spaCy + Rules)")
    print("-" * 50)
    first_pages = "\n".join(p.get("text", "") for p in pages_data[:3]) if pages_data else None
    entities = extract_legal_metadata(full_text, first_pages_text=first_pages)
    print(f"  Court: {entities.get('court_name', {}).get('name', 'Not found')}")
    print(f"  Case Number: {entities.get('case_number', {}).get('number', 'Not found')}")
    judges = entities.get("judges", [])
    if judges:
        print(f"  Judges: {', '.join(j.get('name', '') for j in judges)}")
    parties = entities.get("parties", {})
    if parties:
        print(f"  Petitioner: {parties.get('petitioner', 'N/A')}")
        print(f"  Respondent: {parties.get('respondent', 'N/A')}")
    dates = entities.get("dates", {})
    if dates:
        print(f"  Judgment Date: {dates.get('judgment_date', {}).get('date', 'N/A')}")
    depts = entities.get("departments", [])
    if depts:
        print(f"  Departments: {depts}")

    # Step 3: Directive Extraction
    print("\n" + "-" * 50)
    print("  STEP 3: Directive Extraction (Pattern + NLP)")
    print("-" * 50)
    judgment_date = dates.get("judgment_date", {}).get("date") if dates else None
    directives = extract_directives(
        full_text,
        judgment_date=judgment_date,
        pages_data=pages_data,
    )
    print(f"  Found {len(directives)} directive(s)\n")

    for i, d in enumerate(directives, 1):
        text_preview = d.get("directive_text", "")[:120]
        print(f"  [{i}] {text_preview}...")
        print(f"      Action: {d.get('main_action', 'N/A')}")
        print(f"      Department: {d.get('responsible_department', 'N/A')}")
        deadline_text = d.get("deadline_text")
        if deadline_text:
            resolved = resolve_deadline(deadline_text, judgment_date=judgment_date)
            print(f"      Deadline: {deadline_text} -> {resolved.get('resolved_date', 'unresolved')}")
        print(f"      Confidence: {d.get('confidence', 0):.2f}")
        print()

    # Summary
    print("=" * 70)
    print("  EXTRACTION SUMMARY")
    print("=" * 70)
    print(f"  Text: {len(full_text)} chars from {len(pages_data)} pages ({method})")
    print(f"  Entities: court, case#, {len(judges)} judge(s), parties")
    print(f"  Directives: {len(directives)} extracted")
    if directives:
        avg_conf = sum(d.get("confidence", 0) for d in directives) / len(directives)
        print(f"  Avg Confidence: {avg_conf:.2f}")
    print()

    # Save JSON output
    output = {
        "pdf": os.path.basename(pdf_path),
        "text_length": len(full_text),
        "extraction_method": method,
        "pages": len(pages_data),
        "entities": entities,
        "directives_count": len(directives),
        "directives": directives,
    }
    output_path = str(Path(__file__).parent.parent / "data" / "demo_extraction_output.json")
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2, default=str)
    print(f"  Full JSON output: data/demo_extraction_output.json")
    print()


if __name__ == "__main__":
    main()
