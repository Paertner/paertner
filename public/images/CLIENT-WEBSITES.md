# Client website portfolio assets

Added from the five websites supplied by the user. Real browser captures are used in the inner galleries; cover presentations were generated with the built-in image_gen tool using each actual homepage and the approved Nova cover as references. Full cover prompts are saved beside the cover PNGs.

| Project | Source | Gallery |
| --- | --- | --- |
| Luxora Nova | https://luxoranova.ae/ | Home, About, Services, Contact |
| Velox Energy | https://veloxenergy.ae/ | Home, About, Products, Contact |
| Nexus Oil | https://nexusoil.ae/ | Home, About, Services, Contact |
| EQUIPO | https://equipogroup.com/ | Home, About Us, Services, Contact Us |
| IENSOL | https://iensol.com/ | Home, About Us, Products, Contact Us |

CMS content: `scripts/content/client-website-projects.json`.
Repeatable import: `node scripts/import-client-websites.mjs`.
The import reuses matching media, backs up any existing project record before updates, and publishes the five projects without modifying Nova or the concept projects. Completion years are intentionally left blank because they were not supplied. Case studies describe visible information architecture, visual direction and enquiry paths without invented performance results.
