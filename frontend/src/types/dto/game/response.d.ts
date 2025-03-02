import {
  BaseGameFormData,
  BaseGameListInfo,
  BaseQuestionInfo,
} from "./form-data";

/**
 * @description DTO for a single game item in the game-list or search-list responses
 */
export interface GameListItemResponseDto extends BaseGameListInfo {
  gameId: number;
  creator: string;
}

/**
 * Used when getting the response from `/api/game`
 * @description DTO for the game-list response or search response
 */
export interface GameListResponseDto {
  size: number;
  page: number;
  totalPage: number;
  totalNumber: number;
  games: GameListItemResponseDto[];
}

/**
 * @description DTO for single question item in the GamePlayDetailResponseDto
 */
export interface QuestionItemResponseDto
  extends Omit<BaseQuestionInfo, "questionFileName" | "answerFileName"> {}

/**
 * Used when getting the response from `/api/game/detail`
 * @description DTO for the game detail response
 */
export interface GamePlayDetailResponseDto {
  thumbnailUrl: string;
  title: string;
  description: string;
  questions: QuestionItemResponseDto[];
}

/**
 * Used when getting the response from `/api/game/edit?gameId=`
 * @description DTO for the game-edit response
 */
export interface EditGameDetailResponseDto
  extends Required<Pick<BaseGameFormData, "gameId" | "isVisible">>,
    Omit<BaseGameFormData, "gameId" | "isVisible"> {
  createdAt: string;
  updatedAt: string;
}

/**
 * @description DTO for the single game in all-game-list created by user
 */
export interface MyGameListItemResponseDto extends BaseGameListInfo {
  gameId: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * ENDPOINT: /api/game/all
 * @description DTO for the all-game-list (/api/game/all) response
 */
export interface AllGameListItemResponseDto {
  games: MyGameListItemResponseDto[];
}
