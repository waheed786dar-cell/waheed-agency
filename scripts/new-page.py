#!/usr/bin/env python3
"""
Scaffolds a new HTML page with navbar + footer + boilerplate head already wired in.
Usage: python3 scripts/new-page.py <output_path> "<Page Title>" "<Meta Description>" "<path_prefix>"
path_prefix = "" for root-level pages, "../" for pages/ subfolder, "../../" for pages/services/ etc.
"""
import sys

def main():
    if len(sys.argv) < 5:
        print("Usage: new-page.py <output_path> <title> <description> <path_prefix>")
        sys.exit(1)

    output_path, title, description, prefix = sys.argv[1:5]

    with open('components/navbar.html') as f:
        navbar = f.read().split('-->', 1)[1].strip()
    with open('components/footer.html') as f:
        footer = f.read().split('-->', 1)[1].strip()

    template = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} — Waheed Agency</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="https://waheed786dar-cell.github.io/waheed-agency/{output_path.replace('index.html','').replace('.html','/')}">

  <meta property="og:type" content="website">
  <meta property="og:title" content="{title} — Waheed Agency">
  <meta property="og:description" content="{description}">

  <link rel="icon" type="image/png" href="/assets/images/icons/favicon.png">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0a66ff">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">

  <script>
    (function() {{
      try {{
        var saved = localStorage.getItem('wa_theme_preference');
        var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
      }} catch (e) {{}}
    }})();
  </script>

  <link rel="stylesheet" href="/css/main.css">
</head>
<body>

  <a href="#main-content" class="sr-only">Skip to main content</a>

{navbar}

  <main id="main-content">
    <--analyzer-output PAGE_CONTENT_PLACEHOLDER -->
  </main>

{footer}

  <script src="/js/config/constants.js" defer></script>
  <script src="/js/utils/helpers.js" defer></script>
  <script src="/js/utils/validators.js" defer></script>
  <script src="/js/modules/navigation.js" defer></script>
  <script src="/js/modules/theme-toggle.js" defer></script>
  <script src="/js/modules/scroll-effects.js" defer></script>
  <script src="/js/modules/animations.js" defer></script>
  <script src="/js/modules/form-handler.js" defer></script>
  <script src="/js/modules/lazy-load.js" defer></script>
  <script src="/js/main.js" defer></script>
</body>
</html>
'''

    with open(output_path, 'w') as f:
        f.write(template)
    print(f"Scaffolded: {output_path}")

if __name__ == '__main__':
    main()
