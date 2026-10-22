# Rollup Roadside — Website

24/7 mobile roadside assistance in Katy, TX and the greater Houston area.
Phone: **(713) 804-6234**

Static site built with vanilla HTML, CSS and JavaScript — no build step, no
dependencies. Deploy by serving the repository root.

## Pages

| Path                     | File                              |
| ------------------------ | --------------------------------- |
| `/`                      | `index.html`                      |
| `/services/`             | `services/index.html`             |
| `/air-delivery/`         | `air-delivery/index.html`         |
| `/battery-installation/` | `battery-installation/index.html` |
| `/gasoline-delivery/`    | `gasoline-delivery/index.html`    |
| `/jumpstart-service/`    | `jumpstart-service/index.html`    |
| `/lockout-service/`      | `lockout-service/index.html`      |

`/review` is provided by the hosting platform and is linked from the footer and
the contact section of every page.

## Structure

```
index.html           home page
styles.css           design system + all layout
script.js            mobile nav, scroll reveal, form handling
favicon.svg          favicon
images/source/       photography and logos from the business
<slug>/index.html    one directory per service page
```

## Forms

Every page carries one lead form that posts to LeadrVision:

- `method="POST"` to `https://vision.leadrai.com/api/forms/d36430c2af78651e99d9df173d33c1bb`
- Hidden `_form` (form name), `_page` (stamped with `window.location.href` on
  load) and `_gotcha` (honeypot) fields.
- `script.js` enhances submission with `fetch()` to the same URL and shows an
  inline confirmation on `{"ok": true}`. If JavaScript is unavailable or the
  request fails, the browser performs a normal POST and the visitor returns with
  `?submitted=1`, which also renders the confirmation.

## Local preview

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.
