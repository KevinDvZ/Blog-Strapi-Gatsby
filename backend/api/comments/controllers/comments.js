'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  // this method is called when api to create comment is called
    async create(ctx) {
         // call the function to creating comment with data
        let entity = await strapi.services.comments.create(ctx.request.body);
        // return data for api after removing field which are not exported
        return sanitizeEntity(entity, { model: strapi.models.comments });
    },
    async update(ctx) {
        // get the id of comment which is updated
        const { id } = ctx.params;
        // finding the comment for user and id
        const [comment] = await strapi.services.comments.find({
            id: ctx.params.id,
            'user.id': ctx.state.user.id,
        });
        // comment does not exist send error
        if (!comment) {
            return ctx.unauthorized(`You can't update this entry`);
        }
        // update the comment
        let entity = await strapi.services.comments.update({ id }, ctx.request.body);
         // return data for api after removing field which are not exported
        return sanitizeEntity(entity, { model: strapi.models.comments });
    },
    async delete(ctx) {
        // get the id of comment which is updated
        const { id } = ctx.params;
        // finding the comment for user and id
        const [comment] = await strapi.services.comments.find({
            id: ctx.params.id,
            'user.id': ctx.state.user.id,
        });
        // comment does not exist send error
        if (!comment) {
            return ctx.unauthorized(`You can't update this entry`);
        }
        // delete the comment
        let entity = await strapi.services.comments.delete({ id });
         // return data for api after removing field which are not exported
        return sanitizeEntity(entity, { model: strapi.models.comments });
    },
};
