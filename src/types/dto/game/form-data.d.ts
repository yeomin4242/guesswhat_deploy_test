/**
 * @description 게임의 필수 정보.
 * Game List 를 불러올 시 (`/`, `/profile/me` 등) 사용됩니다.
 *
 * @param {string} title - 제목
 * @param {string} thumbnailUrl - 게임의 썸네일 URL
 * @param {string[]} tags - 태그
 */
export interface BaseGameListInfo {
  title: string;
  thumbnailUrl: string;
  tags: string[];
}

/**
 * @description 게임 내 문제의 필수 정보.
 *
 * @param {string} id - 문제의 고유 ID
 * @param {string} question - 문제
 * @param {string} questionUrl - 문제 이미지 URL
 * @param {string[]} answer - 답변 리스트
 * @param {string} answerUrl - 답변 이미지 URL
 * @param {string} [questionFileName] - 문제 이미지 파일명
 * @param {string} [answerFileName] - 답변 이미지 파일명
 */
export interface BaseQuestionInfo {
  questionId: string;
  question: string;
  questionUrl: string;
  answer: string[];
  answerUrl: string;
  questionFileName?: string;
  answerFileName?: string;
}

export interface BaseGameFormData {
  gameId?: number;
  creatorId?: string;
  thumbnailUrl: string;
  thumbnailFileName?: string;
  title: string;
  description: string;
  tags: string[];
  questions: BaseQuestionInfo[];
  isVisible?: boolean;
}
