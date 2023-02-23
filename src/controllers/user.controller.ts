import {authenticate, TokenService} from '@loopback/authentication';
import {Credentials, TokenServiceBindings, User, UserRepository} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, HttpErrors, post, requestBody} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import {CustomUserServiceBindings} from '../key';
import {MyUserService} from '../services/user.service';

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject(CustomUserServiceBindings.USER_SERVICE) public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true}) public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @post('/users/login')
  async login(@requestBody() credentials: Credentials) {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  /* TODO: validations on email format
  as interceptor???
  **/
  @post('/users/signup')
  async signup(@requestBody(
    {
      content: {
        'application/json': {
          schema: {
            properties: {
              email: {
                format: 'email'
              }
            }
          }
        }
      }
    }
  ) user: User) {
    const userExists = await this.userRepository.findOne({
      where: {
        email: user.email
      }
    })

    if (!userExists) {
      const password = await hash(user.password, await genSalt());
      const savedUser = await this.userRepository.create({...user, password})

      await this.userRepository.userCredentials(savedUser.id).create({password});

      return savedUser;
    }

    throw new HttpErrors.BadRequest('Email already used.')
  }

  @authenticate('jwt')
  @get('/users/profile')
  async profile(@inject(SecurityBindings.USER) user: UserProfile) {
    const userId = user[securityId]
    return this.userRepository.findById(userId, {include: ['tweets']});
  }
}
