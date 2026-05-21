from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
template = (root / "scripts" / "services_mega_menu_block.html").read_text(encoding="utf-8")

pattern = re.compile(
    r'<li class="nav-item-dropdown(?: nav-item-dropdown--services)?">\s*'
    r'<a href="(\./|\.\./)services\.html" class="nav-link-item nav-link-with-arrow"[\s\S]*?>\s*Services\s*</a\s*>\s*'
    r'(?:<ul class="dropdown-menu">.*?</ul>\s*</li>|<div class="dropdown-menu services-mega-menu">.*?</div>\s*</div>\s*</li>)',
    re.DOTALL | re.IGNORECASE,
)

changed = []
for f in root.rglob("*.html"):
    if f.parent.name == "scripts":
        continue
    text = f.read_text(encoding="utf-8", errors="ignore")
    if not re.search(
        r'nav-link-with-arrow"[\s\S]*?>\s*Services\s*</a',
        text,
        re.IGNORECASE,
    ):
        continue

    def repl(m):
        return template.replace("{{PREFIX}}", m.group(1))

    new_text, n = pattern.subn(repl, text, count=1)
    if n:
        f.write_text(new_text, encoding="utf-8", newline="\n")
        changed.append(str(f.relative_to(root)))

print("\n".join(changed))
print(f"TOTAL_CHANGED={len(changed)}")
