export function getAnswerQuestionRelationship(answers, questions){             
    return answers.map(answerObj => {
        const questionObj = questions.find(question => question.field === Object.keys(answerObj)[1]);
        return {
            id: answerObj.id,
            question: questionObj.id,
            answer: answerObj[questionObj.field]
        }
    });
}