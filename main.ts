import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { json } from "express";
import helmet from "helmet";

import { TournamentModule } from "./modules/tournaments/tournaments.module";
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

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
    logger: ["error", "warn", "debug", "log"],
  });
  app.enableShutdownHooks();

  app.use(
    helmet({
      hidePoweredBy: true,
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false, // this is to allow redoc
    }),
  );
  app.setGlobalPrefix("api");
  app.use(json({ limit: "25mb" }));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("Grand Slam of Curling")
    .setDescription("The gsoc API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [
      TeamModule,
      SheetModule,
      ThrowTypeModule,
      VenueModule,
      FormatModule,
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
    ],
    deepScanRoutes: true,
  });
  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });

  app.enableCors();

  await app.listen(9200);

  Logger.log(`🚀 Application is running on: http://localhost:${9200}`);
}

export default bootstrap();
