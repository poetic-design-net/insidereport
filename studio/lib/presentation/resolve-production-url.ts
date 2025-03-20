import { definePlugin } from 'sanity'

// Define a resolver function for document URLs
export const resolveProductionUrl = definePlugin({
  name: 'resolve-production-url',
  document: {
    productionUrl: async (prev, { document, getClient }) => {
      // Only handle post documents
      if (!document || document.type !== 'post') {
        return prev
      }

      // Get the slug from the document
      const slug = await getClient().fetch(
        `*[_id == $id][0].slug.current`,
        { id: document._id }
      )

      if (!slug) {
        return prev
      }

      // Return the URL for the document
      return `/blog/${slug}`
    },
  },
})

export default resolveProductionUrl
