CREATE TABLE `fields` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`farmId` text,
	`location` text NOT NULL,
	`position` text NOT NULL,
	`bounds` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fieldsMapInfo` (
	`id` text PRIMARY KEY NOT NULL,
	`defaultOverlayImgKey` text,
	`defaultOverlayImgPath` text,
	`nitrogenOverlayImgKey` text,
	`nitrogenOverlayImgPath` text,
	`anomalyOverlayImgKey` text,
	`anomalyOverlayImgPath` text,
	`growthOverlayImgKey` text,
	`growthOverlayImgPath` text,
	`irrigationOverlayImgKey` text,
	`irrigationOverlayImgPath` text
);
--> statement-breakpoint
CREATE TABLE `fieldsDetails` (
	`id` text PRIMARY KEY NOT NULL,
	`cropType` text,
	`cropAge` text,
	`lastInfoUpdate` text,
	`lastCropUpdate` text,
	`lastIrrigationUpdate` text,
	`lastScoutUpdate` text,
	`growthPercentage` text,
	`nutrientsPercentage` text,
	`stressPercentage` text,
	`growthTrend` numeric,
	`nutrientsTrend` numeric,
	`stressTrend` numeric
);
--> statement-breakpoint
CREATE TABLE `fieldsScoutPoints` (
	`id` text PRIMARY KEY NOT NULL,
	`fieldId` text NOT NULL,
	`isDirty` integer DEFAULT false NOT NULL,
	`isNew` integer DEFAULT false,
	`date` integer NOT NULL,
	`location` text NOT NULL,
	`severity` text NOT NULL,
	`category` text NOT NULL,
	`notes` text,
	`reply` text,
	`lastUpdate` text NOT NULL,
	`photosKeys` text,
	`voiceNoteKey` text,
	`videoKey` text,
	`photosFiles` text,
	`voiceNoteFile` text,
	`voiceReplyFile` text
);
