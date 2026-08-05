export const structure = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("About Page")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Activities Page")
        .child(S.document().schemaType("activitiesPage").documentId("activitiesPage")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !["aboutPage", "activitiesPage"].includes(item.getId())
      ),
    ]);
