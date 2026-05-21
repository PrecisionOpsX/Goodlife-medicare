from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
mobile_template = (root / "scripts" / "services_mobile_menu_block.html").read_text(encoding="utf-8")

pattern = re.compile(
    r'(<li class="nav-item-dropdown nav-item-dropdown--services">[\s\S]*?'
    r'<div class="dropdown-menu services-mega-menu"[\s\S]*?</div>\s*</motion>\s*</motion>\s*)(\s*</li>)',
    re.DOTALL,
)

# fix pattern - mega menu has two closing divs not motion
pattern = re.compile(
    r'(<li class="nav-item-dropdown nav-item-dropdown--services">[\s\S]*?'
    r'<div class="dropdown-menu services-mega-menu"[\s\S]*?</div>\s*</div>\s*)(\s*</li>)',
    re.DOTALL,
)

changed = []
for f in root.rglob("*.html"):
    if f.parent.name == "scripts":
        continue
    text = f.read_text(encoding="utf-8", errors="ignore")
    if "nav-item-dropdown--services" not in text:
        continue
    if "services-dropdown-menu--mobile" in text:
        continue

    prefix_match = re.search(
        r'nav-item-dropdown--services">[\s\S]*?<a href="(\./|\.\./)services\.html"',
        text,
    )
    if not prefix_match:
        continue
    prefix = prefix_match.group(1)
    mobile_block = mobile_template.replace("{{PREFIX}}", prefix)

    def repl(m):
        return m.group(1) + "\n" + mobile_block + m.group(2)

    new_text, n = pattern.subn(repl, text, count=1)
    if n:
        f.write_text(new_text, encoding="utf-8", newline="\n")
        changed.append(str(f.relative_to(root)))

print("\n".join(changed))
print(f"TOTAL_CHANGED={len(changed)}")
