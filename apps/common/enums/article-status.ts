export enum ArticleStatus {
  unpublished = 0,
  published = 10,
}

export const ArticleStatusItems = [
  { Id: ArticleStatus.unpublished, Name: '未發布' },
  { Id: ArticleStatus.published, Name: '已發布' },
];
