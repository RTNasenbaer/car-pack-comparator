from __future__ import annotations

import argparse
import datetime as dt
import json
from collections import Counter
from pathlib import Path
import xml.etree.ElementTree as ET

DEFAULT_PATTERN = "cupra_tavascan*.xml"
SUPPORTED_LANGUAGES = ["en", "es", "de", "fr"]

PREFERRED_ORDER = [
    "cupra_tavascan_standard_pack",
    "cupra_tavascan_immersive_pack",
    "cupra_tavascan_adrenaline_pack",
    "cupra_tavascan_extreme_pack",
]
ORDER_INDEX = {name: index for index, name in enumerate(PREFERRED_ORDER)}


class PackParseError(Exception):
    pass


def parse_pack(file_path: Path) -> dict:
    try:
        tree = ET.parse(file_path)
    except ET.ParseError as exc:
        raise PackParseError(f"{file_path.name}: XML parse error: {exc}") from exc

    root = tree.getroot()
    if root.tag != "carConfiguration":
        raise PackParseError(
            f"{file_path.name}: root tag must be 'carConfiguration', got '{root.tag}'"
        )

    pack_name = root.attrib.get("name", file_path.stem)
    categories: dict[str, list[str]] = {}
    category_order: list[str] = []
    duplicate_features: dict[str, list[dict]] = {}
    feature_locations: dict[str, list[str]] = {}
    empty_categories: list[str] = []

    for category in root.findall("category"):
        category_name = category.attrib.get("name", "Unnamed Category")
        category_order.append(category_name)

        features: list[str] = []
        for feature in category.findall("feature"):
            feature_text = (feature.text or "").strip()
            if feature_text:
                features.append(feature_text)
            feature_locations.setdefault(feature_text, []).append(category_name)

        categories[category_name] = features

        if not features:
            empty_categories.append(category_name)

        counts = Counter(features)
        duplicates = [
            {"feature": feature, "count": count}
            for feature, count in counts.items()
            if count > 1
        ]
        if duplicates:
            duplicate_features[category_name] = duplicates

    duplicate_features_global: list[dict] = []
    for feature_text, locations in feature_locations.items():
        if len(locations) > 1:
            duplicate_features_global.append(
                {
                    "feature": feature_text,
                    "count": len(locations),
                    "categories": list(dict.fromkeys(locations)),
                }
            )

    if not categories:
        raise PackParseError(f"{file_path.name}: no <category> entries found")

    return {
        "fileName": file_path.name,
        "name": pack_name,
        "categories": categories,
        "categoryOrder": category_order,
        "duplicateFeatures": duplicate_features,
        "duplicateFeaturesGlobal": duplicate_features_global,
        "emptyCategories": empty_categories,
    }


def build_category_order(packs: list[dict]) -> list[str]:
    ordered: list[str] = []
    seen: set[str] = set()
    for pack in packs:
        for category in pack["categoryOrder"]:
            if category not in seen:
                seen.add(category)
                ordered.append(category)
    return ordered


def collect_warnings(packs: list[dict]) -> list[str]:
    warnings: list[str] = []
    for pack in packs:
        for category_name in pack["emptyCategories"]:
            warnings.append(
                f"{pack['name']}: category '{category_name}' has no feature entries."
            )

        for category_name, duplicates in pack["duplicateFeatures"].items():
            for duplicate in duplicates:
                warnings.append(
                    f"{pack['name']}: feature appears {duplicate['count']}x in "
                    f"'{category_name}': {duplicate['feature']}"
                )

        for duplicate in pack["duplicateFeaturesGlobal"]:
          warnings.append(
            f"{pack['name']}: feature appears in multiple categories "
            f"({', '.join(duplicate['categories'])}): {duplicate['feature']}"
          )

    return warnings


def to_json_document(payload: dict) -> str:
    return json.dumps(payload, indent=2, ensure_ascii=False)


def collect_files(base_dir: Path, pattern: str) -> list[Path]:
    files = list(base_dir.glob(pattern))
    files.sort(key=lambda path: (ORDER_INDEX.get(path.stem, 999), path.name))
    return files


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate a JSON comparison report for car pack XML files."
    )
    parser.add_argument(
        "--base-dir",
        default="src/data",
        help="Directory containing XML files (default: src/data)",
    )
    parser.add_argument(
        "--pattern",
        default=DEFAULT_PATTERN,
        help=f"XML file glob pattern (default: {DEFAULT_PATTERN})",
    )
    parser.add_argument(
        "--output-dir",
        default="public",
        help="Output directory for JSON files (default: public)",
    )

    args = parser.parse_args()
    base_dir = Path(args.base_dir).resolve()
    xml_files = collect_files(base_dir, args.pattern)

    if not xml_files:
        raise SystemExit(f"No files found for pattern '{args.pattern}' in {base_dir}")

    packs: list[dict] = []
    for xml_file in xml_files:
        packs.append(parse_pack(xml_file))

    payload = {
        "generatedAt": dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "packs": packs,
        "categoryOrder": build_category_order(packs),
        "warnings": collect_warnings(packs),
    }

    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    for lang in SUPPORTED_LANGUAGES:
        output_path = output_dir / f"data_{lang}.json"
        output_path.write_text(to_json_document(payload), encoding="utf-8")
        print(f"Generated report for {lang}: {output_path}")

    print(f"XML files parsed: {len(xml_files)}")

    if payload["warnings"]:
        print("Sanity warnings:")
        for warning in payload["warnings"]:
            print(f"- {warning}")
    else:
        print("No sanity warnings.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
