export const load = async (event) => {
    return {
      session: event.locals.getSession ? await event.locals.getSession() : null,
    }
  }