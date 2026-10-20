# Cloud Native Readiness Assessment

## Build

Install dependencies and create the production build:

```sh
npm install
npm run build
```

Vite writes the output to `dist/`. The AEM embed snippets expect the built files at:

- `/content/dam/cloud-native-readiness/main.js`
- `/content/dam/cloud-native-readiness/main.css`

## AEM embed

For a demo or an AEM environment configured to serve JavaScript modules from DAM:

1. Build the project.
2. In AEM Assets, create the `cloud-native-readiness` folder under `/content/dam/`.
3. Upload `dist/main.js` and `dist/main.css` to that folder and publish them.
4. Add [aem-assessment-body.html](aem-assessment-body.html) to the assessment page.
5. Add [aem-report-body.html](aem-report-body.html) to the report page.

The assessment embed creates report links by appending `/report/` to the current assessment path. Configure AEM routing or rewrites so that URL resolves to the report page. If your AEM page URLs use a different pattern (such as `.html` paths), adjust the URL construction in `src/js/encoder.js` to match it.

## Production deployment note

AEM as a Cloud Service treats uploaded executable files as inert DAM assets by default. As a result, JavaScript uploaded to DAM might not execute as a module. For production, deploy the JavaScript and CSS through the AEM project (for example, as a client library) or an approved static asset host, then update the URLs in the two AEM embed snippets. Confirm the deployed JavaScript is served with a JavaScript MIME type and is allowed by the site's content security policy.

Adobe documentation:

- [Upload assets in AEM Assets](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/assets-view/add-delete-assets-view?lang=en)
- [Publish assets to AEM](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/assets-view/publish-assets-to-aem-and-dm)
- [Add digital assets to AEM](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/add-assets)
