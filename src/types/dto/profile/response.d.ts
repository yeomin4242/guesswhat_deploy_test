import { BaseGameFormData } from "@/types/dto/game/form-data";

/**
 * @description DTO for the my-game-list (/api/profile/me/games) response
 */
export interface MyGameListItemResponseDto {
  gameId: number;
  title: string;
  tags: string[];
  thumbnailUrl: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * ENDPOINT: /api/profile/me
 * @description DTO for the my-profile (/api/profile/me) response
 */
export interface MyProfileResponseDto {
  email: string;
  games: MyGameListItemResponseDto[];
}
