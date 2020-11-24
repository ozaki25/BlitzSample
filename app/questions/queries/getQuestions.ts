import { Ctx } from "blitz"
import db, { FindManyQuestionArgs } from "db"

type GetQuestionsInput = Pick<
  FindManyQuestionArgs,
  "where" | "orderBy" | "cursor" | "take" | "skip"
>

export default async function getQuestions(
  { where, orderBy, cursor, take, skip }: GetQuestionsInput,
  ctx: Ctx
) {
  ctx.session.authorize()

  const questions = await db.question.findMany({
    where,
    orderBy,
    cursor,
    take,
    skip,
    include: { choices: true },
  })

  const count = await db.question.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    questions,
    nextPage,
    hasMore,
    count,
  }
}
