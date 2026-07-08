#!/usr/bin/env python3
"""
Converts absolute paths (href="/...", src="/...") to relative paths
based on each file's depth in the folder structure.
This makes the site work both at domain root (Vercel) and in a
subfolder (GitHub Pages /waheed-agency/).

Root-level files (index.html, 404.html) -> depth 0 -> "/x" becomes "x"
pages/about.html                         -> depth 1 -> "/x" becomes "../x"
pages/services/index.html                -> depth 2 -> "/x" becomes "../../x"
"""
import re
import os

FILES = [
    '404.html',
    'components/footer.html',
    'components/navbar.html',
    'index.html',
    'pages/about.html',
    'pages/blog.html',
    'pages/careers.html',
    'pages/contact.html',
    'pages/faq.html',
    'pages/legal/privacy-policy.html',
    'pages/legal/terms-of-service.html',
    'pages/portfolio/case-study-template.html',
    'pages/portfolio/index.html',
    'pages/services/app-development.html',
    'pages/services/cloud-devops.html',
    'pages/services/index.html',
    'pages/services/seo-marketing.html',
    'pages/services/ui-ux-design.html',
    'pages/services/web-development.html',
]

def get_prefix(filepath):
    # components/*.html are snippets injected elsewhere; treat as depth of injection sites is tricky,
    # so we handle them same as their typical usage depth: navbar/footer are used at root AND pages/*
    # We special-case them below instead of via depth.
    depth = filepath.count('/')
    return '../' * depth if depth > 0 else ''

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    if filepath.startswith('components/'):
        # These are reference snippets copy-pasted into pages at various depths.
        # We leave them as root-relative markers using a placeholder convention:
        # Just report and skip automatic rewrite - flagged for manual attention.
        return None

    prefix = get_prefix(filepath)

    # Replace href="/xxx" and src="/xxx" but NOT href="//external" (protocol-relative)
    # and NOT href="/" (home link stays special-cased separately)
    def replace_attr(match):
        attr = match.group(1)
        path = match.group(2)
        if path == '':  # href="/" -> home link
            return f'{attr}="{prefix}index.html"' if prefix else f'{attr}="/"'
        return f'{attr}="{prefix}{path}"'

    content = re.sub(r'(href|src)="/([^/"][^"]*)"', lambda m: f'{m.group(1)}="{prefix}{m.group(2)}"', content)
    content = re.sub(r'(href)="/"', lambda m: f'href="{prefix}index.html"' if prefix else 'href="/"', content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

changed = []
skipped = []
for f in FILES:
    result = fix_file(f)
    if result is None:
        skipped.append(f)
    elif result:
        changed.append(f)

print(f"Changed: {len(changed)} files")
for f in changed:
    print(f"  - {f}")
print(f"\nSkipped (manual attention needed): {len(skipped)} files")
for f in skipped:
    print(f"  - {f}")
