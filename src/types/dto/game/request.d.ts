import {
  BaseGameFormData,
  BaseGameFormInfo,
  BaseQuestionInfo,
} from "./form-data";

/**
 * @description DTO for a single question item in the CreateGameRequestDto
 *
 * @param {string} id - unique ID for referencing
 * @param {string} questionUrl - image URL for the question
 * @param {string} question - text of the question
 * @param {string[]} answer - possible answer (or a single correct answer)
 * @param {string} answerUrl - image URL for the answer
 * @param {string} questionFileName - image file name for the question
 * @param {string} answerFileName - image file name for the answer
 */
export interface QuestionItemRequestDto extends BaseQuestionInfo {}

/**
 * Used when sending a POST request to `/api/game/create`
 * @description DTO for the request to create a new game.
 *
 * @param {string} thumbnailUrl - the final uploaded thumbnailUrl URL
 * @param {string} title - title of the game
 * @param {string} description - description of the game
 * @param {string[]} tags - tags for the game
 * @param {QuestionItemRequestDto[]} questions - list of questions
 */
export interface CreateGameRequestDto
  extends Omit<BaseGameFormData, "gameId" | "isVisible"> {}

/**
 * Used when sending a POST request to `/api/game/update`
 * @description DTO for the request to update an existing game.
 */
export interface UpdateGameRequestDto
  extends Required<Pick<BaseGameFormData, "isVisible">>,
    Omit<BaseGameFormData, "thumbnailFileName"> {}

export interface CreateGameFormRequestDto {
  thumbnail: string;
  thumbnailFileName?: string;
  title: string;
  description: string;
  tags: string[];
  questions: QuestionItemRequestDto[];
}

export interface QuestionApiRequestDto {
  question: string;
  questionUrl: string;
  answer: string[];
  answerUrl: string | null;
}

export interface CreateGameApiRequestDto {
  thumbnailUrl: string;
  title: string;
  description: string;
  tags: string[];
  creatorId: string;
  questions: QuestionApiRequestDto[];
}
