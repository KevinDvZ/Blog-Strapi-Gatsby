import React, {useEffect, useState} from "react";
import { graphql } from "gatsby";
// import Img from "gatsby-image"
import { GatsbyImage } from "gatsby-plugin-image"
import Moment from "react-moment";
import Layout from "../components/layout";
import Markdown from "react-markdown";
import Comments from '../components/comments';


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
        gatsbyImageData(layout: FIXED)
                }
      }
      author {
        name
        picture {
          childImageSharp {
        gatsbyImageData(layout: FIXED)
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
  // A utiliser si fetch par graphql souhaité, mais cela demande rebuild gatsby et ajouter commande graphql
  //const comments = data.allStrapiComments.nodes;
  // commande graph ql :
  /*
  allStrapiComments(filter: {article: {slug: { eq: $slug }}}) {
    nodes {
      email
      message
      author
      created_at(formatString: "DD MMMM YYYY à HH:MM", locale: "FR")
      strapiId
    }
  }
   */

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
                  <GatsbyImage
                    fixed={article.author.picture.childImageSharp.gatsbyImageData}
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
          <div className="comment-section">
            <h4 className="comment-header">Commentaires</h4>
            <Comments comments={comments} article={article}/>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Article;