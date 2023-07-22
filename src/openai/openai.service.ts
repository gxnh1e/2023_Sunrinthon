import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { OpenAIApi, Configuration } from "openai";

@Injectable()
export class OpenaiService {
  openai: OpenAIApi;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.openai = new OpenAIApi(new Configuration({ apiKey: config.get<string>('OPENAI_API_KEY') }));
  }

  async create(id: string, question: string) {
    const username = await this.prisma.user.findFirst({
      where: {
        id: id
      },
      select: {
        username: true
      }
    });
    const prompt = `
이 사람은 MBTI 중 하나가 I와 F인 사람입니다. MBTI에 맞게 위로 해주세요. 아래 [YOUR INPUT] 부분을 채워주세요.  최대 30자 정도의 중간 정도의 글로 유저를 위로해주세요. 또한 위로하는 글 이기때문에 MBTI에 관한 언급은 하지 말아주세요.
=========
${username.username} : ${question}
당신 : [YOUR INPUT]`;

    try {
      const response = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1000,
      });

      const generatedText = response.data.choices[0].text;
      console.log(generatedText);
      console.log(generatedText.length);

      return generatedText;
    } catch (error) {
      console.error('Failed to generate text:', error);
      throw new Error('Failed to generate text.');
    }
  }
}
