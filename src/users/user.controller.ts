import { ConfigService } from '@nestjs/config';
import { createUserDto } from './../dtos/create-user.dto';
import { UserDto } from './../dtos/user-dto';
import { UserService } from './user.service';
import { Body, Controller, Get, Param, Post, Req, Request, Res } from "@nestjs/common";
import ApiError from '../exceptions/api-error'



@Controller('/api')
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService
    ) { }
    @Get()
    test() {
        return this.userService.test()
    }
    @Post('/registration')
    async registration(@Body() createUserDto: createUserDto, @Res({ passthrough: true }) response) {
        try {
            // getting user data
            const login = createUserDto.login
            const password = createUserDto.password
            const fullName = createUserDto.fullName
            const email = createUserDto.email
            const phone = createUserDto.phone
            const address = createUserDto.address
            console.log(`create ${login} and ${password} name ${fullName}`);


            const userData = await this.userService.registration(login, password, fullName, email, phone, address)
            console.log(userData)
            response.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return {
                userData
            }

        } catch (error) {
            if (error instanceof ApiError) {
                response.status(401).send('Unauthorized user')
            }
        }

    }
    @Post('/login')
    async login(@Body() createUserDto: createUserDto, @Res({ passthrough: true }) res) {


        // getting request`s body data
        const login = createUserDto.login
        const password = createUserDto.password

        console.log(`Login ${login} and ${password}`);
        const userData = await this.userService.login(login, password)
        console.log(`${userData.refreshToken} - fuck bliat cookie file`)
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

        return {
            userData
        }

    }
    @Post('/logout')
    async logout(@Req() req: Request, @Res() res) {
        const token = await this.userService.logout(req)
        res.clearCookie('refreshToken')
        return { token }
    }

    @Get('/refresh')
    async refresh(@Req() req, @Res() res) {

        const { refreshToken } = req.cookies
        console.log(refreshToken);

        const userData = await this.userService.refresh(refreshToken)
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
        console.log('responding');
        console.log(userData);

        res.send(userData)
    }

    @Get('/users')
    async getUsers(@Req() req) {
        try {
            const users = await this.userService.getUsers()
            return users
        } catch (e) {
            console.log(e);

        }
    }

    @Get('/activate/:link')
    async activate(@Param('link') link: string, @Res() res) {
        try {
            await this.userService.activate(link)
            return res.status(200).redirect(this.configService.get('REDIRECT_LINK'))
        } catch (error) {
            console.log(error);
        }
    }

    // @Get('/profile')
    // async getProfile(@Req() req) {
    //     try {

    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
    @Post('/callback')
    async subscription(@Body() body) {
        await this.userService.callBack()
        console.log(body);
        return 'PEZDA'
    }
}

