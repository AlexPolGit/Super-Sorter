/**
 * Data for logging in a user.
 */
export interface UserLoginDto {
    username: string;
    password: string;
}

/**
 * Data for creating a new user.
 * Currently identical to {@link UserLogin}.
 */
export interface UserRegisterDto extends UserLoginDto {}
