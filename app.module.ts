import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

import { TeamModule } from "./modules/team/team.module";
import { SheetModule } from "./modules/sheet/sheet.module";
import { ThrowTypeModule } from "./modules/throw-type/throw-type.module";
import { VenueModule } from "./modules/venue/venue.module";
import { FormatModule } from "./modules/format/format.module";
import { MatchModule } from "./modules/match/match.module";
import { MatchTeamModule } from "./modules/match-team/match-team.module";
import { EndModule } from "./modules/end/end.module";
import { LsdThrowModule } from "./modules/lsd-throw/lsd-throw.module";
import { ThrowModule } from "./modules/throw/throw.module";
import { SeasonModule } from "./modules/season/season.module";
import { CurlerModule } from "./modules/curler/curler.module";
import { CompetitionModule } from "./modules/competition/competition.module";
import { CompetitionTeamModule } from "./modules/competition-team/competition-team.module";
import { CompetitionRoundModule } from "./modules/competition-round/competition-round.module";
import HealthModule from "./modules/system/health/health.module";
import { TournamentModule } from "./modules/tournaments/tournaments.module";
import { SocketModule } from "./modules/socket/socket.module";

import ValidationPipe from "./pipes/Validation.pipe";

import AllExceptionsFilter from "./filters/AllExceptions.filter";
import NotFoundFilter from "./filters/NotFound.filter";

import ResponseTransformInterceptor from "./interceptors/Response.interceptor";

import envConfiguration from "./config/configuration";
import databaseConfig from "./config/database";

import envValidate from "./validations/env.validation";
import ApiConfigService from "./services/app-config.service";

@Module({
  imports: [
    // ConfigModule loads the .env file
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      cache: true,
      validate: envValidate,
      load: [envConfiguration],
    }),

    // TypeOrmModule configuration with values from the .env file
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          ...databaseConfig,
        };
      },
      inject: [ConfigService], // Inject ConfigService to access the env variables
    }),
    SocketModule,
    SheetModule,
    ThrowTypeModule,
    VenueModule,
    FormatModule,
    TeamModule,
    MatchModule,
    MatchTeamModule,
    EndModule,
    LsdThrowModule,
    ThrowModule,
    SeasonModule,
    CurlerModule,
    CompetitionModule,
    CompetitionTeamModule,
    CompetitionRoundModule,
    TournamentModule,
    HealthModule,
  ],
  providers: [
    ApiConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
