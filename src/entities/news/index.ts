export {
  fetchNews,
  fetchNewsByKeywords,
  fetchRecommendedNewServer
} from './api/news.server'
export type { News } from './model/type'
export { getInitialNews } from './api/news.ssr'
