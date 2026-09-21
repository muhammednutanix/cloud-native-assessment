# AEM Embed

The app renders into a container supplied by the AEM Embed Component. It does
not need to own the page `body`.

After `npm run build`, upload `dist/main.css` and `dist/main.js` to:
`/content/dam/cloud-native-readiness/`.

Upload the files as DAM assets with these exact names. Do not upload only the
HTML snippets; the snippets reference these two files at runtime. Before adding
the Embed Component, verify that both URLs open the actual asset rather than an
AEM 404 page:

- `/content/dam/cloud-native-readiness/main.css`
- `/content/dam/cloud-native-readiness/main.js`

The CSS URL should return `text/css`, and the JavaScript URL should return
`application/javascript` or `text/javascript`. If either URL returns 404 or
`text/html`, the asset has not been published or the DAM path/permissions do
not match the snippet.

## Assessment component

The assessment page path is:
`/content/nutanix/language-masters/en/cloud-native-readiness`

Copy the contents of [aem-assessment-body.html](aem-assessment-body.html)
directly into the AEM page body:

```html
<link
  rel="stylesheet"
  href="/content/dam/cloud-native-readiness/main.css"
/>
<div data-cna-assessment></div>
<script
  type="module"
  src="/content/dam/cloud-native-readiness/main.js"
></script>
```

## Report component

Create the AEM report page at
`/content/nutanix/language-masters/en/cloud-native-readiness/report` and place this
copyable body snippet inside the AEM page body:

Copy the contents of [aem-report-body.html](aem-report-body.html):

```html
<link
  rel="stylesheet"
  href="/content/dam/cloud-native-readiness/main.css"
/>
<div data-cna-report></div>
<script
  type="module"
  src="/content/dam/cloud-native-readiness/main.js"
></script>
```

The assessment navigates to the report page with the encoded result in the
`result` query parameter. The report component reads that parameter and fills
its own container. The same source is available locally at:

- `http://localhost:5173/`
- `http://localhost:5173/report/`

Run `npm run dev` from the project directory to test locally.
