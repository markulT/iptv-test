import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";
import {AdminController} from "./admin.controller";
import {AdminService} from "./admin.service";
import {TokenService} from "../token/token.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Admin, AdminSchema} from "./admin.schema";
import {TokenModule} from "../token/token.module";
import {Token, TokenSchema} from "../token/token.schema";
import {ConfigService} from "@nestjs/config";
import {CaslModule} from "../casl/casl.module";
import {authMiddleware} from "../middlewares/auth-middleware";
import {UserService} from "../users/user.service";
import {User, UserSchema} from "../users/user.schema";
import {JwtService} from "@nestjs/jwt";
import {MailService} from "../mail/mail.service";


@Module({
    imports:[
        MongooseModule.forFeature([{name:Admin.name, schema:AdminSchema}]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
        TokenModule,
        CaslModule
    ],
    controllers:[AdminController],
    providers:[AdminService, TokenService, ConfigService, UserService, JwtService, MailService]
})
export class AdminModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(authMiddleware)
            .exclude(
                {path:'/admin/login',method:RequestMethod.ALL},
                {path:'/admin/register',method:RequestMethod.ALL},

            )
            .forRoutes(AdminController)
    }
}