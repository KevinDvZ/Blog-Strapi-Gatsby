# Tuto pour repoduire ce blog Strapi / Gatsby

Lien du rendu final : https://blog-strapi-gatsby-kevindvz.vercel.app/

##Disclaimer
*Ne pas hésiter à visiter pour des infos plus précises sur la mise en place:* `https://jamstatic.fr/2018/04/26/construire-un-blog-statique-avec-gatsby-et-strapi/`

***Nous passerons en revues le tuto de cette page `https://strapi.io/blog/build-a-static-blog-with-gatsby-and-strapi`, avec les correctifs du tuto en plus (merci aux feedback des simploniens), puis selon les exigences d'un exercice dans le cadre de ma formation, je vous proposerai mon interprétation du développement de la partie des commentaires des articles***

## Pré-requis
### (les commandes peuvent se faire dans tout terminal, dans tout dossier)

* Yarn cli ou npm (préférer tout de même yarn) est installer en global sur votre pc
* Gatsby cli doit être installer aussi globalement. Faire dans votre terminal : `yarn global add gatsby-cli`
* Avoir un compte actif chez Heroku
* Avoir un compte actif chez Vercel
* `yarn add global kill-port`


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

```
require("dotenv").config({
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
    `yarn add uikit && add @fontsource/staatliches && add gatsby-plugin && add gatsby-image && yarn add 'babel-preset-gatsby' && yarn add react-markdown react-moment moment`

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
*  `connectrefused` s'activent, c'est que vous n'avez pas lancer un terminal démarrant le backend, ou que le .env et manquant / mal plaçé.
* de type `lifecycle`, vous avez probablement oubliez de créer certains fichier ou ne les avez pas placer dans le bon dossier (attention au fichier css notamment), ou qu'il vous manque un package à add avec YARN (attention aux packages manquant de l'étape 19 notamment).

**Attention à bien re-suivre les étapes dans l'ordre.**

**Ainsi les bases du front devraient être fonctionnelles.**

21. Si tout est stable, il est conseillé à ce stade d'initilaliser le repo GIT à la racine du projet bac et front, et de le pusher. Pour celà, dans frontend supprimer le .git , couper tout les terminaux (du back et du front)
* Ouvrir le terminal à la racine du projet, faire la commande `git init`
* `git branch -M main`
* `git add . && git commit -m "initialisation blog strapi"`
* créer un repo sur Github
* `git remote add origin **lien du github** `
* `git push --set-upstream origin main`
* `git push`

Pensez à réactiver votre backend et front end avec yarn start dans les deux dossier et deux terminaux différents ouverts en parallèles.

## Nav component

22. Création du nav component. Créer un fichier à cet emplacement du frontend : `./src/components/nav.js` , contenant :
```
import React from "react";
import { Link, StaticQuery, graphql } from "gatsby";

const Nav = () => (
  <StaticQuery
    query={graphql`
      query {
        strapiGlobal {
          siteName
        }
        allStrapiCategory {
          edges {
            node {
              slug
              name
            }
          }
        }
      }
    `}
    render={(data) => (
      <div>
        <div>
          <nav className="uk-navbar-container" data-uk-navbar>
            <div className="uk-navbar-left">
              <ul className="uk-navbar-nav">
                <li>
                  <Link to="/">{data.strapiGlobal.siteName}</Link>
                </li>
              </ul>
            </div>
            <div className="uk-navbar-right">
              <button
                className="uk-button uk-button-default uk-margin-right"
                type="button"
              >
                Categories
              </button>
              <div uk-dropdown="animation: uk-animation-slide-top-small; duration: 1000">
                <ul className="uk-nav uk-dropdown-nav">
                  {data.allStrapiCategory.edges.map((category, i) => (
                    <li key={`category__${category.node.slug}`}>
                      <Link to={`/category/${category.node.slug}`}>
                        {category.node.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    )}
  />
);

export default Nav;
```
fermer, enregistrer.

23. Ouvrir le fichier `components/layout.js` , ajouter juste en dessous des imports, au dessus de const Layout (ligne 5 normalement) :
```
import Nav from "./nav";
```

et rajouter en dessous de la balise `<Seo seo={seo}=>` (entre la ligne 24 et 25 normalement) :
`<Nav />`

***si vous souhaitez voir le résultat, vous pouvez faire le `yarn start` dans votre dossier frontend, et afficher localhost:8080, vous derviez avoir Strapi Blog et catégories d'affichier en haut de la page***

## Articles

24. Remplacer le contenu entier du fichier `pages/index.js` du frontend par :
```
import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Layout from "../components/layout";
import ArticlesComponent from "../components/articles";
import "../assets/css/main.css";

const IndexPage = () => {
  const data = useStaticQuery(query);

  return (
    <Layout seo={data.strapiHomepage.seo}>
      <div className="uk-section">
        <div className="uk-container uk-container-large">
          <h1>{data.strapiHomepage.hero.title}</h1>
          <ArticlesComponent articles={data.allStrapiArticle.edges} />
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
    allStrapiArticle(filter: { status: { eq: "published" } }) {
      edges {
        node {
          strapiId
          slug
          title
          category {
            name
          }
          image {
            childImageSharp {
              fixed(width: 800, height: 500) {
                src
              }
            }
          }
          author {
            name
            picture {
              childImageSharp {
                fixed(width: 30, height: 30) {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
```
25. Créer un fichier `article.js` dans le dossier `components`, y copier coller ce code :
```
import React from "react";
import Card from "./card";

const Articles = ({ articles }) => {
  const leftArticlesCount = Math.ceil(articles.length / 5);
  const leftArticles = articles.slice(0, leftArticlesCount);
  const rightArticles = articles.slice(leftArticlesCount, articles.length);

  return (
    <div>
      <div className="uk-child-width-1-2@s" data-uk-grid="true">
        <div>
          {leftArticles.map((article, i) => {
            return (
              <Card
                article={article}
                key={`article__left__${article.node.slug}`}
              />
            );
          })}
        </div>
        <div>
          <div className="uk-child-width-1-2@m uk-grid-match" data-uk-grid>
            {rightArticles.map((article, i) => {
              return (
                <Card
                  article={article}
                  key={`article__right__${article.node.slug}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;
```

Le composant est bientôit pret, il lui manque le sous composant Card

26. Créer un fichier `card.js` dans le dossier `components`, y copier coller ce code :

```
import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image";

const Card = ({ article }) => {
  return (
    <Link to={`/article/${article.node.slug}`} className="uk-link-reset">
      <div className="uk-card uk-card-muted">
        <div className="uk-card-media-top">
          <Img
            fixed={article.node.image.childImageSharp.fixed}
            imgStyle={{ position: "static" }}
          />
        </div>
        <div className="uk-card-body">
          <p id="category" className="uk-text-uppercase">
            {article.node.category.name}
          </p>
          <p id="title" className="uk-text-large">
            {article.node.title}
          </p>
          <div>
            <hr className="uk-divider-small" />
            <div className="uk-grid-small uk-flex-left" data-uk-grid="true">
              <div>
                {article.node.author.picture && (
                  <Img
                    fixed={article.node.author.picture.childImageSharp.fixed}
                    imgStyle={{ position: "static", borderRadius: "50%" }}
                  />
                )}
              </div>
              <div className="uk-width-expand">
                <p className="uk-margin-remove-bottom">
                  {article.node.author.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
```

*Si vos deux terminaux du back et front sont toujours actifs, et que vous rafraichissez localhost:8000, les articles devraient s'afficher.*

Maintenant que les articles sont initialisés, passons aux pages.

## Les pages du blogs

27. A la racine du dossier frontend, se trouve le fichier `gatsby-node.js`. Copier coller ce code à l'intérieur, à la suite du texte déjà présent :
```
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(
    `
      {
        articles: allStrapiArticle {
          edges {
            node {
              strapiId
              slug
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    throw result.errors;
  }

  // Create blog articles pages.
  const articles = result.data.articles.edges;

  const ArticleTemplate = require.resolve("./src/templates/article.js");

  articles.forEach((article, index) => {
    createPage({
      path: `/article/${article.node.slug}`,
      component: ArticleTemplate,
      context: {
        slug: article.node.slug,
      },
    });
  });
};

module.exports.onCreateNode = async ({ node, actions, createNodeId }) => {
  const crypto = require(`crypto`);

  if (node.internal.type === "StrapiArticle") {
    const newNode = {
      id: createNodeId(`StrapiArticleContent-${node.id}`),
      parent: node.id,
      children: [],
      internal: {
        content: node.content || " ",
        type: "StrapiArticleContent",
        mediaType: "text/markdown",
        contentDigest: crypto
          .createHash("md5")
          .update(node.content || " ")
          .digest("hex"),
      },
    };
    actions.createNode(newNode);
    actions.createParentChildLink({
      parent: node,
      child: newNode,
    });
  }
};
```
28. Faire à la racine de frontend : `yarn add react-markdown react-moment moment`

29.  Créer un fichier `article.js` dans le dossier `src/templates` (templates doit être aussi créé), coller dedans :
```
import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import Moment from "react-moment";
import Layout from "../components/layout";
import Markdown from "react-markdown";

export const query = graphql`
  query ArticleQuery($slug: String!) {
    strapiArticle(slug: { eq: $slug }, status: { eq: "published" }) {
      strapiId
      title
      description
      content
      publishedAt
      image {
        publicURL
        childImageSharp {
          fixed {
            src
          }
        }
      }
      author {
        name
        picture {
          childImageSharp {
            fixed(width: 30, height: 30) {
              src
            }
          }
        }
      }
    }
  }
`;

const Article = ({ data }) => {
  const article = data.strapiArticle;
  const seo = {
    metaTitle: article.title,
    metaDescription: article.description,
    shareImage: article.image,
    article: true,
  };

  return (
    <Layout seo={seo}>
      <div>
        <div
          id="banner"
          className="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light uk-padding uk-margin"
          data-src={article.image.publicURL}
          data-srcset={article.image.publicURL}
          data-uk-img
        >
          <h1>{article.title}</h1>
        </div>

        <div className="uk-section">
          <div className="uk-container uk-container-small">
            <Markdown source={article.content} escapeHtml={false} />

            <hr className="uk-divider-small" />

            <div className="uk-grid-small uk-flex-left" data-uk-grid="true">
              <div>
                {article.author.picture && (
                  <Img
                    fixed={article.author.picture.childImageSharp.fixed}
                    imgStyle={{ position: "static", borderRadius: "50%" }}
                  />
                )}
              </div>
              <div className="uk-width-expand">
                <p className="uk-margin-remove-bottom">
                  By {article.author.name}
                </p>
                <p className="uk-text-meta uk-margin-remove-top">
                  <Moment format="MMM Do YYYY">{article.published_at}</Moment>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Article;
```

30. Fermer le terminal du front (pas besoin pour le back) , et redémarrer le serveur en faisant yarn start à la racine de frontend. Vérifier si tout roule.

31. On va créer les catégories, il va falloir pour celà écraser (encore !) le contenu du fichier `gatsby-node.js`. Remplacer par ce code :
```
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(
    `
      {
        articles: allStrapiArticle {
          edges {
            node {
              strapiId
              slug
            }
          }
        }
        categories: allStrapiCategory {
          edges {
            node {
              strapiId
              slug
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    throw result.errors;
  }

  // Create blog articles pages.
  const articles = result.data.articles.edges;
  const categories = result.data.categories.edges;

  const ArticleTemplate = require.resolve("./src/templates/article.js");

  articles.forEach((article, index) => {
    createPage({
      path: `/article/${article.node.slug}`,
      component: ArticleTemplate,
      context: {
        slug: article.node.slug,
      },
    });
  });

  const CategoryTemplate = require.resolve("./src/templates/category.js");

  categories.forEach((category, index) => {
    createPage({
      path: `/category/${category.node.slug}`,
      component: CategoryTemplate,
      context: {
        slug: category.node.slug,
      },
    });
  });
};

module.exports.onCreateNode = async ({ node, actions, createNodeId }) => {
  const crypto = require(`crypto`);

  if (node.internal.type === "StrapiArticle") {
    const newNode = {
      id: createNodeId(`StrapiArticleContent-${node.id}`),
      parent: node.id,
      children: [],
      internal: {
        content: node.content || " ",
        type: "StrapiArticleContent",
        mediaType: "text/markdown",
        contentDigest: crypto
          .createHash("md5")
          .update(node.content || " ")
          .digest("hex"),
      },
    };
    actions.createNode(newNode);
    actions.createParentChildLink({
      parent: node,
      child: newNode,
    });
  }
};
```

32. créer dans le dossier templates, à cotés de article.js, un fichier `category.js` contenante ce code :
```
import React from "react";
import { graphql } from "gatsby";
import ArticlesComponent from "../components/articles";
import Layout from "../components/layout";

export const query = graphql`
  query Category($slug: String!) {
    articles: allStrapiArticle(
      filter: { status: { eq: "published" }, category: { slug: { eq: $slug } } }
    ) {
      edges {
        node {
          slug
          title
          category {
            name
          }
          image {
            childImageSharp {
              fixed(width: 660) {
                src
              }
            }
          }
          author {
            name
            picture {
              childImageSharp {
                fixed(width: 30, height: 30) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      }
    }
    category: strapiCategory(slug: { eq: $slug }) {
      name
    }
  }
`;

const Category = ({ data }) => {
  const articles = data.articles.edges;
  const category = data.category.name;
  const seo = {
    metaTitle: category,
    metaDescription: `All ${category} articles`,
  };

  return (
    <Layout seo={seo}>
      <div className="uk-section">
        <div className="uk-container uk-container-large">
          <h1>{category}</h1>
          <ArticlesComponent articles={articles} />
        </div>
      </div>
    </Layout>
  );
};

export default Category;
```

Redémarrer le serveur front end, les catégories devraient être maintenant fonctionnelles.

## Les exigences du brief Simplon

### Les commentaires

Pour rappel, le brief demande :
```
Comme votre but est de générer de l'engagement, vous vous devrez d'ajouter un espace de commentaire en dessous des articles.

Il doit donc y avoir un blog avec quelques articles (vous pouvez laisser ceux fourni en exemples), un formulaire d'ajout de commentaire en dessous de chaque articles suivi de la liste des commentaire pour cet article.
```

Voici mon approche :
en back end, j'ai utilisé l'outil de création `Content Types Builder`, présent dans la navbar sous la catégorie Plugins, dans l'admnistration de Strapi. J'ai donc configurer sur mon PC le plugins Comments, commiter sur le repo et pusher. Il est important que la fonctionnalité soit stable pour qu'elle puisse être pushée sur Heroku.

1. Démarrer Stapi via le terminal (yarn start)
2. Accéder à Content TYpe Builder`
3. Cliquer sur "Créer un type de Collection"
4. Dans le formulaire, nommer cette nouvelle collection "Comment", valider
5. Cliquer sur "Ajouter un champ à cette collection"
6. Cliquer sur Relations
7. Vérifier bien que l'état de relation entre un commentaire et un article soit sur "Comment a un Article" (flechè avec un point comme départ, la première en partant de la gauche dans la liste). Cliquer sur Terminer.
8. Répéter l'opération pour composer tout ce qui est intégré au commentaires. Pour ma part j'ai ajouter un champ email, un champ texte (de type long text) que j'ai nommé "message". Valider. L'interface va surement vous demander de redémarrer le serveur, accepter.

Redémarrer le serveur (fermer le terminal, en ouvrir un nouveau dans le dossier backend et yarn start)

11. Se reconnecter sur localhost:1337/admin/

12. Créer des commentaires bidons en allant dans la nav bar à gauche dans le menu `Comment`

13. remplisser le formulaire de vos champs, en oubliant pas de faire correspondre le commentaire à un article (bloc article détail sur la droite, menu déroulant).

14. Maintenant que des commentaires bidons sont liés à un ou des articles, il faut les publier. Aller sur chaque commentaire et cliquer sur Publier en haut à droite.

15. Modification des permissions : aller dans Paramètres > Rôles Et Permissions > Public puis cocher dans la section comment create, findOne, find. Sauvegarder.

Vous pouvez tester dans Postman au endoint localhost:1337/comment voir si le json des commentaires sortent bien.

Allons maintenant faire les modifs nécessaires en front end.

# Front-end : Gatsby

**(attention, dans mon cas j'ai nommé ma classe "Comments", au pluriel. Faites attention à faire correspondre les codes suivant avec votre projet en corrigeant l'erreur. )**


## La liste des commentaires doit s'afficher dans les articles. 
### Disclaimer :
*Cette partie est le fruit d'une recherche chaotique, et je ne peux garantir que tout soit stable. Ainsi, il faut être vigilant à plusieurs chose :*
1. l'orhtographe des variables, attention pour moi ``Comments`` est au pluriel.
2. les variables d'environnement : Il est important d'utiliser le préfixe GATSBY *exemple: GATSBY_API_URL* et non *API_URL*. Ne pas hésiter à la renommer dans votre fichier .env et dans tout le projet.
3. le point le plus outrageant : les mises à jour innatendue de gatsby, qui utilise certaines dépendances parfois totalement différente. *exemple: Gatsby_Image* (cf : https://discord.com/channels/@me/761576309532786728/831160056421810266 )

### Création de l'espace commentaire 
~~On va devoir modifier le modèle des articles. J'ai décidé donc de passer par GraphQL, qui sous-tend le focntionnement de Gatsby, en utilisant le "slug" de chaque article ( extension de lien url de chaque article).
Il faut savoir que chaque commande que j'ai utilisé ont été généré par GraphIql, l'interface de génération de requetes de Gatsby. Avant de pourvoir y accéder, il faut inclure les "commentaires" au moment de la compilation de Gatsby.~~

**Faux : on ne peux pas se servir de la requete graphql pour mettre a jour dynamiquement Gatsby. Vercel ne prends pas en compte le hook refresh.
Solution : faire un fetch qui est appelé a chaque état de React.**

1. Créer un fichier comments.js dans le dossier components/, y copier-coller ce code :
```

import '../assets/css/comment.css';
import React from 'react'

let localHoust ="";

const submitForm = ((ev, strapiId) => {
 localHoust =  window.location.protocol + "//" + window.location.host;
 ev.preventDefault();
 fetch(`${process.env.GATSBY_API_URL}`, {
        method: 'post',
        headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                "query": `mutation ($input: createCommentInput!){createComment(input: $input){comment{message, author, article{id}}}}`,
                "variables": {
                        "input": {
                                "data": {
                                 "article": strapiId,
                                 "author": ev.target.author.value,
                                 "message": ev.target.message.value,


                                }
                        }
                },
        }),
}).then((res) => fetch(`${localHoust}/__refresh`, {method:'POST'})).then(() =>
console.log(localHoust))})


const Comments = ({ comments, article }) => {
console.log(comments)
        return (
            <div>
                <hr />
                <div className="comment-list">
                    {comments.length ? (
                        comments.map((comment) => (
                         <div className="comment-block">
                            <h4 className="comment-author">Ecrit par : {comment.author}</h4>
                                 <h4 className="comment-date"> le {comment.created_at}</h4>
                                 <p className="comment-content">{comment.message}</p>
                         </div>
                                                 ))
                    ) : (
                        <h5 className="no-comments-alert">
                            No comments on this post yet. Be the first!
                        </h5>
                    )}
                </div>

                    <form className="comment-form" onSubmit={ev => submitForm(ev, article.strapiId)}>
                            <h4 className="comment-post">Laissez un commentaire</h4>
                            <input
                             type="text"
                             placeholder="Votre pseudo/nom"
                             name="author"
                            />
                            <textarea
                             type="text"
                             placeholder="Votre commentaire"
                             rows="4"
                             name="message"
                            />
                            <div>
                                    <button className="button submit-button" type="submit">Envoyer</button>
                            </div>
                    </form>

            </div>
        );
};

export default Comments;
```

7. Créer le fichier comment.css dans `src/css`, y copier coller ce code :

```
.comment-form {
    display: flex;
    flex-direction: column;
    width: 50%;
    padding: 100px 25px 20px 0;
    margin-left: auto;
    margin-right: auto;
    }
.comment-form > input,
.comment-form > textarea {
    width: 100%;
    border: 3px solid rgb(143, 51, 143);
    margin: 12px 0;
    padding: 7px 14px;
    font-size: 14px;
    opacity: 0.8;
    font-weight: bold;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.3);
    border-radius: 8px;
}
.comment-form > div > .submit-button {
    padding: 8px 45px;
    background: rgb(143, 51, 143);
    color: whitesmoke;
    border-radius: 35px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    text-transform: uppercase;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}
.comment__meta > h5 {
    font-size: 15px;
    color: purple;
    opacity: 0.7;
    margin-bottom: 3px;
    line-height: 1;
}
hr {
    background: rgba(0, 0, 0, 0.2);
    height: 3px;
}
.comment__meta > span {
    font-size: 14px;
    font-weight: bold;
    opacity: 0.5;
}
.comment__body {
    font-size: 18px;
    opacity: 0.8;
    font-family: 'Rajdhani', cursive;
}
.no-comments-alert {
    font-size: 16px;
    color: purple;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: -0.3px;
}

.comment-block {
    border: 5px solid;
    padding: 15px;
    margin-top: 10px;
    border-radius: 30px;

}

.comment-date {
    float: right
}

.comment-author {
    float: left;
}
.comment-block p {
    text-align: center
}

```


8. Dans le fichier `templates/article.js`, remplacer tout les imports par :

```
import React, {useEffect, useState} from "react";
import { graphql } from "gatsby";
// import Img from "gatsby-image"
import { GatsbyImage } from "gatsby-plugin-image"
import Moment from "react-moment";
import Layout from "../components/layout";
import Markdown from "react-markdown";
import Comments from '../components/comments';
```

8. Dans le fichier `templates/article.js`, rajouter la déclaration des commentaires quelque-part dans votre template (pour ma part ligne 98), en collant le code suivant

```
          <div className="comment-section">
            <h4 className="comment-header">Commentaires</h4>
            <Comments comments={comments} article={article}/>
          </div>
```

9. Dans le fichier template ``article.js``, copier coller ce code avant le **return** :
```
// Rendu côté client
  const [comments, setComments] = useState(0)
  useEffect(() => {
    // fetch depuis strapi
    fetch(
        process.env.GATSBY_API_URL + "/comments?article=" +
        data.strapiArticle.strapiId
    )
        .then(res => res.json())
        .then(data => {
          setComments(data);
        })
  }, [data.strapiArticle.strapiId])
```
9. Enregistrer / redémarrer. Si tout se passe bien, la liste des commentaires pour chaque article devrait s'afficher. Libre à vous de modifier son css.

