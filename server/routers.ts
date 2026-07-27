import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getOrCreateProfile, getProfileByUserId, updateProfile, getPortfolioWorks, createPortfolioWork, followUser, unfollowUser, sendMessage, getMessages, createNotification, getNotifications, likeWork, unlikeWork, createStory, getStories, getUserStories, createComment, getStoryComments } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Profile routes
  profile: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      return getOrCreateProfile(ctx.user.id);
    }),
    getById: publicProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
      return getProfileByUserId(input.userId);
    }),
    update: protectedProcedure.input(z.object({
      bio: z.string().optional(),
      profession: z.string().optional(),
      skills: z.array(z.string()).optional(),
      hourlyRate: z.string().optional(),
      isAvailableForHire: z.boolean().optional(),
      youtubeUrl: z.string().optional(),
      instagramUrl: z.string().optional(),
      twitterUrl: z.string().optional(),
      portfolioUrl: z.string().optional(),
      avatarUrl: z.string().optional(),
      coverImageUrl: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      return updateProfile(ctx.user.id, input);
    }),
  }),

  // Portfolio routes
  portfolio: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getPortfolioWorks(ctx.user.id);
    }),
    create: protectedProcedure.input(z.object({
      title: z.string(),
      description: z.string().optional(),
      imageUrl: z.string(),
      templateId: z.string().optional(),
      category: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      return createPortfolioWork({
        userId: ctx.user.id,
        ...input,
      });
    }),
  }),

  // Social routes
  social: router({
    follow: protectedProcedure.input(z.object({ userId: z.number() })).mutation(async ({ ctx, input }) => {
      return followUser(ctx.user.id, input.userId);
    }),
    unfollow: protectedProcedure.input(z.object({ userId: z.number() })).mutation(async ({ ctx, input }) => {
      return unfollowUser(ctx.user.id, input.userId);
    }),
  }),

  // Messaging routes
  messages: router({
    send: protectedProcedure.input(z.object({ recipientId: z.number(), content: z.string() })).mutation(async ({ ctx, input }) => {
      return sendMessage(ctx.user.id, input.recipientId, input.content);
    }),
    getConversation: protectedProcedure.input(z.object({ userId: z.number() })).query(async ({ ctx, input }) => {
      return getMessages(ctx.user.id, input.userId);
    }),
  }),

  // Notification routes
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getNotifications(ctx.user.id);
    }),
    create: protectedProcedure.input(z.object({
      type: z.enum(["follower", "message", "profile_view", "like", "comment"]),
      fromUserId: z.number().optional(),
      message: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      return createNotification({
        userId: ctx.user.id,
        ...input,
      });
    }),
  }),

  // Like routes
  likes: router({
    like: protectedProcedure.input(z.object({ workId: z.number() })).mutation(async ({ ctx, input }) => {
      return likeWork(ctx.user.id, input.workId);
    }),
    unlike: protectedProcedure.input(z.object({ workId: z.number() })).mutation(async ({ ctx, input }) => {
      return unlikeWork(ctx.user.id, input.workId);
    }),
  }),

  // Story routes
  stories: router({
    create: protectedProcedure.input(z.object({
      imageUrl: z.string(),
      caption: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      return createStory({
        userId: ctx.user.id,
        ...input,
      });
    }),
    list: publicProcedure.input(z.object({
      limit: z.number().default(20),
      offset: z.number().default(0),
    })).query(async ({ input }) => {
      return getStories(input.limit, input.offset);
    }),
    getUserStories: publicProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
      return getUserStories(input.userId);
    }),
  }),

  // Comment routes
  comments: router({
    create: protectedProcedure.input(z.object({
      storyId: z.number(),
      content: z.string(),
    })).mutation(async ({ ctx, input }) => {
      return createComment({
        storyId: input.storyId,
        userId: ctx.user.id,
        content: input.content,
      });
    }),
    getByStory: publicProcedure.input(z.object({ storyId: z.number() })).query(async ({ input }) => {
      return getStoryComments(input.storyId);
    }),
  }),
});

export type AppRouter = typeof appRouter;
