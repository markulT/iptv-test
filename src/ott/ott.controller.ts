import {Controller, Get, Req, Res} from '@nestjs/common';
import {OttService} from "./ott.service";
import * as bcrypt from 'bcrypt'
import * as crypto from "crypto";
import {Request} from "express";


@Controller('ott')
export class OttController {
    constructor(
        private ottService: OttService
    ) {
    }

    @Get('/stream')
    async getStream(@Req() req: Request,@Res({passthrough:true}) res) {
        console.log('pedor')
        const flussonic = 'http://193.176.179.12:8880',
            secretKey = '1212a88787b87878c0707d07ef',
            streamId = 'support9',
            ipRequest = req.header('x-forwarded-for'),
            lifetime = 3600 * 3,
            startTime = Date.now() - 300,
            endTime = Date.now() + lifetime,
            salt = (Math.random() * 8 ** 8).toString().slice(8),
            shasum = crypto.createHash('sha1'),
            urlString = streamId + ipRequest + startTime + endTime + secretKey + salt;
        console.log(ipRequest)
        console.log(urlString)
        shasum.update(urlString)
        const hash = shasum.digest('hex')
        const token = hash + '-' + salt + '-' + endTime + '-' + startTime
        const url = flussonic + '/' + streamId + '/' + 'index.m3u8?token=' + token
        return {url, bebra:'guacamole nigga penis'}
    }
}
