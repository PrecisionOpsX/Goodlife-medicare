from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]

# Orphaned tail of old services dropdown left after mega-menu insert
orphan_re = re.compile(
    r"\n\s*<li class=\"dropdown-item-has-children header-dropdown-level-1\">"
    r"[\s\S]*?"
    r"\n\s*</ul>\s*\n\s*</li>\s*\n"
    r"(?=\s*<li class=\"nav-item-dropdown\">\s*\n\s*<a href=\"#\")",
)

changed = []
for f in root.rglob("*.html"):
    if f.parent.name == "scripts":
        continue
    text = f.read_text(encoding="utf-8", errors="ignore")
    if "services-mega-menu" not in text:
        continue
    new_text, n = orphan_re.subn("\n", text)
    if n:
        f.write_text(new_text, encoding="utf-8", newline="\n")
        changed.append(f"{f.relative_to(root)} ({n})")

print("\n".join(changed))
print(f"CLEANED={len(changed)}")
