
export type Definition = {
    id: string,
    title: string,
    text: string,
    imageUrl: string,
    color: string,
    tags: string[],
    likes: number,
    dislikes: number,
    references: string[],
    faq: string[],
    featured: boolean
}