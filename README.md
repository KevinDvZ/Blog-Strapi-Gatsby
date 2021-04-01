# Tuto pour repoduire ce blog Strapi / Gatsby 

## Pré-requis 
### (les commandes peuvent se faire dans tout terminal, dans tout dossier)

* Yarn cli ou npm (préférer tout de même yarn) est installer en global sur votre pc
* Gatsby cli doit être installer aussi globalement. Faire dans votre terminal : `yarn global add gatsby-cli`
* Avoir un compte actif chez Heroku
* Avoir un compte actif chez Vercel


## Installation et initalisation

1. créer un dossier de travail (nommé blog-strapi dans notre exemple)
2. placer votre terminal dans ce dossier (cd + chemin  du dossier)
3. Entrer `yarn create strapi-app backend  --quickstart --template https://github.com/strapi/strapi-template-blog`
4. Entrer `yarn develop`
5. Laisser tourner le terminal et les téléchargements s'effectuer
6. A la fin des opérations, votre navigateur par défaut devrait s'ouvrir à l'adresse `http://localhost:1337/admin/` 
**Vous pouvez créer un compte avec mot de passe, et vous ballader dans l'interface pour prendre connaissance des "lieux". Strapi est actif (le back-end pour l'instant)**
7. Quitter le terminal
9. Ouvrir le dossier du projet à sa racine dans le terminal (cd + chemin  du dossier, au même niveau que le dossier blog-strapi, attention pas à l'intérieur)
10. Faire `gatsby new frontend`. Ne pas stresser si le terminal semble bloquer, des opérations se font en fait en arrière plan.
11. Faire comme dit dans le terminal : `cd frontend` puis `gatsby develop`
12. Laisser mouliner jusqu'au "success Building". Ouvrir dans son navigateur : `http://localhost:8000/` , Gatsby default starter devrait s'afficher. Les bases du back sont prêtes. Fermer le terminal.
13. Revenir à la racine du projet (au meme niveau que les deux dossier blog-strapi & backend)
14. Ouvrir à ce niveau le terminal, entrer la commande `touch .env`, un ficher .env s'est créer. Faire un clic droit dessus et ouvrir avec le bloc note windows.
15. Y copier / coller ces deux lignes 
* `GATSBY_ROOT_URL=http://localhost:8000`
* `API_URL=http://localhost:1337`

 Fermer le ficher en enregistrant. Le fichier .env est maintenant à côté du dossier blog-strapi du dossier frontend.

16. Ouvrir le terminal dans le dossier frontend
13. Faire la commande `yarn add gatsby-source-strapi`, laisser mouliner
14. Entrer dans le dossier front-end, éditer le fichier gatsy-config.js. Remplacer le contenu de ce fichier par ce texte. 

```require("dotenv").config({
  path: `.env`,
});

module.exports = {
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-strapi",
      options: {
        apiURL: process.env.API_URL || "http://localhost:1337",
        contentTypes: ["article", "category", "writer"],
        singleTypes: [`homepage`, `global`],
        queryLimit: 1000,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "gatsby-starter-default",
        short_name: "starter",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: `src/images/gatsby-icon.png`
      },
    },
    "gatsby-plugin-offline",
  ],
};
```

Enregistrer le fichier et fermer.

19. Ouvrir dans le dossier frontend le terminal, lancer cette commande :
`yarn add uikit && add @fontsource/staatliches && add gatsby-plugin && add gatsby-image && yarn add 'babel-preset-gatsby'`

20. Editer le fichier `seo.js` se trouvant dans `src/components/` . Ecraser le texte à l'intérieur et le remplacer par ce copier coller :

```
import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const SEO = ({ seo = {} }) => {
  const { strapiGlobal } = useStaticQuery(query);
  const { defaultSeo, siteName, favicon } = strapiGlobal;

  // Merge default and page-specific SEO values
  const fullSeo = { ...defaultSeo, ...seo };

  const getMetaTags = () => {
    const tags = [];

    if (fullSeo.metaTitle) {
      tags.push(
        {
          property: "og:title",
          content: fullSeo.metaTitle,
        },
        {
          name: "twitter:title",
          content: fullSeo.metaTitle,
        }
      );
    }
    if (fullSeo.metaDescription) {
      tags.push(
        {
          name: "description",
          content: fullSeo.metaDescription,
        },
        {
          property: "og:description",
          content: fullSeo.metaDescription,
        },
        {
          name: "twitter:description",
          content: fullSeo.metaDescription,
        }
      );
    }
    if (fullSeo.shareImage) {
      const imageUrl =
        (process.env.GATSBY_ROOT_URL || "http://localhost:8000") +
        fullSeo.shareImage.publicURL;
      tags.push(
        {
          name: "image",
          content: imageUrl,
        },
        {
          property: "og:image",
          content: imageUrl,
        },
        {
          name: "twitter:image",
          content: imageUrl,
        }
      );
    }
    if (fullSeo.article) {
      tags.push({
        property: "og:type",
        content: "article",
      });
    }
    tags.push({ name: "twitter:card", content: "summary_large_image" });

    return tags;
  };

  const metaTags = getMetaTags();

  return (
    <Helmet
      title={fullSeo.metaTitle}
      titleTemplate={`%s | ${siteName}`}
      link={[
        {
          rel: "icon",
          href: favicon.publicURL,
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Staatliches",
        },
        {
          rel: "stylesheet",
          href:
            "https://cdn.jsdelivr.net/npm/uikit@3.2.3/dist/css/uikit.min.css",
        },
      ]}
      script={[
        {
          src:
            "https://cdnjs.cloudflare.com/ajax/libs/uikit/3.2.0/js/uikit.min.js",
        },
        {
          src:
            "https://cdn.jsdelivr.net/npm/uikit@3.2.3/dist/js/uikit-icons.min.js",
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/uikit/3.2.0/js/uikit.js",
        },
      ]}
      meta={metaTags}
    />
  );
};

export default SEO;

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  article: PropTypes.bool,
};

SEO.defaultProps = {
  title: null,
  description: null,
  image: null,
  article: false,
};

const query = graphql`
  query {
    strapiGlobal {
      siteName
      favicon {
        publicURL
      }
      defaultSeo {
        metaTitle
        metaDescription
        shareImage {
          publicURL
        }
      }
    }
  }
`;
```

21. Dans le dossier `src/assets/css/` , créer un fichier nommé `main.css` . Copier/ coller à l'intérieur ce code :

```
a {
  text-decoration: none !important;
}

h1 {
  font-family: Staatliches !important;
  font-size: 120px !important;
}

#category {
  font-family: Staatliches !important;
  font-weight: 500 !important;
}

#title {
  letter-spacing: 0.4px !important;
  font-size: 22px !important;
  font-size: 1.375rem !important;
  line-height: 1.13636 !important;
}

#banner {
  margin: 20px !important;
  height: 800px !important;
}

#editor {
  font-size: 16px !important;
  font-size: 1rem !important;
  line-height: 1.75 !important;
}

.uk-navbar-container {
  background: #fff !important;
  font-family: Staatliches !important;
}

img:hover {
  opacity: 1 !important;
  transition: opacity 0.25s cubic-bezier(0.39, 0.575, 0.565, 1) !important;
}
```
Enregistrer, fermer le fichier css.

**Les bases sont posées, il est le temps de modifier le contenu**

## Mise en place du contenu
22. Suppression de contenu par défaut inutile :
* à la racine du dossier frontend, ouvrir le terminal et entrer cette commande :
`rm src/components/header.js src/components/layout.css src/components/image.js src/pages/page-2.js src/pages/using-typescript.tsx`

* remplacer le contenu du fichier `/pages/index.js` par :
```
import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Layout from "../components/layout";
import "../assets/css/main.css";

const IndexPage = () => {
  const data = useStaticQuery(query);

  return (
    <Layout seo={data.strapiHomepage.seo}>
      <div className="uk-section">
        <div className="uk-container uk-container-large">
          <h1>{data.strapiHomepage.hero.title}</h1>
        </div>
      </div>
    </Layout>
  );
};

const query = graphql`
  query {
    strapiHomepage {
      hero {
        title
      }
      seo {
        metaTitle
        metaDescription
        shareImage {
          publicURL
        }
      }
    }
  }
`;

export default IndexPage;
```
Comme à chaque fois, enregistrer et fermer.

* remplacer le contenu du fichier `components/layout.js` par :
```
import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import Seo from "./seo";

const Layout = ({ children, seo }) => (
  <StaticQuery
    query={graphql`
      query {
        strapiHomepage {
          seo {
            metaTitle
            metaDescription
            shareImage {
              publicURL
            }
          }
        }
      }
    `}
    render={(data) => (
      <>
        <Seo seo={seo} />
        <main>{children}</main>
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
```
20. **Essayer de voir si le blog est fonctionnel :** 
a. à la racine du backend (blog-strapi), effecteur cette commande dans le terminal : `yarn start`. Laisser le terminal ouvert en arrière plan.
b. à la racine de front-end, effecteur cette commande dans un nouveau terminal : `yarn start`
c. Ouvrir localhost:8000 et normalement une page blance avec écrit MY BLOG s'affiche. Si des erreurs de type :
*  `connectrefused` s'activent, c'est que vous n'avez pas lancer un terminal démarrant le backend. 
* de type `lifecycle`, vous avez probablement oubliez de créer certains fichier ou ne les avez pas placer dans le bon dossier (attention au fichier css notamment), ou qu'il vous manque un package à add avec YARN (attention aux packages manquant de l'étape 19 notamment). 

**Attention à bien re-suivre les étapes dans l'ordre.**

**Ainsi les bases du front devraient être fonctionnelles.** 

21. Si tout est stable, il est conseillé à ce stade d'initilaliser le repo Github à la racine du projet bac et front. Pour celà, dans frontend supprimer le .git .
* Ouvrir le terminal à la racine du projet, faire la commande `git init`
* `git branch -M main`
* créer un repo sur Github
* pusher le projet sur l'adresse du repo