from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
panels_template = (root / "scripts" / "services_mega_menu_panels.html").read_text(encoding="utf-8")

panels_re = re.compile(
    r'<div class="services-mega-menu__panels">.*?</div>\s*</div>\s*</div>\s*(?=<ul class="dropdown-menu services-dropdown-menu--mobile">)',
    re.DOTALL,
)

changed = []
for f in root.rglob("*.html"):
    if f.parent.name == "scripts":
        continue
    text = f.read_text(encoding="utf-8", errors="ignore")
    if "services-mega-menu__panels" not in text:
        continue

    prefix_match = re.search(
        r'nav-item-dropdown--services">[\s\S]*?<a href="(\./|\.\./)services\.html"',
        text,
    )
    if not prefix_match:
        continue
    prefix = prefix_match.group(1)
    new_panels_block = (
        '<div class="services-mega-menu__panels">'
        + panels_template.replace("{{PREFIX}}", prefix)
        + "</div>\n            </div>\n          </div>\n          "
    )

    new_text, n = panels_re.subn(new_panels_block, text, count=1)
    if n:
        f.write_text(new_text, encoding="utf-8", newline="\n")
        changed.append(str(f.relative_to(root)))

print("\n".join(changed))
print(f"TOTAL_CHANGED={len(changed)}")
