import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.red-pill.ai/v1',
  apiKey: '<redpill-api-key>',
});

const PROMPT = "Generate a legal contract using the following text: ";

async function getCompletion(messageContent) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: PROMPT + messageContent }],
      model: 'gpt-4o',
    });

    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error fetching completion:', error);
  }
}



const businessDiscussion = `
Emily: 
"Hey James, I wanted to go over the proposal for the new project with Web3Ventures LLC. Have you had a chance to review the terms for the software development contract?"

James: 
"Yes, I went through it last night. I think the scope looks good, but I’m concerned about the timeline. They’re asking for a 3-month delivery window, which feels a bit tight given the complexity of the mobile app integration."

Emily: 
"I agree. We might need to negotiate for an additional month, especially since we’ll be integrating blockchain features into the backend. It's not something we can rush without thorough testing."

James: 
"Exactly. I think we should also add a clause about post-launch support. They’ve been unclear about what happens after the initial deployment, and I don’t want us to be stuck with unexpected maintenance requests."

Emily: 
"Good point. I’ll draft a version that includes a 6-month post-launch support period and an option for them to extend it if necessary. Also, what do you think about their budget? Do you think $200,000 is enough to cover everything, including security audits?"

James: 
"It’s reasonable, but we might run into issues if the security audits reveal any major vulnerabilities that require additional work. I’ll propose a contingency fund of 10% for unforeseen issues."

Emily: 
"Sounds good. I’ll handle the revisions and set up a meeting with their team next week to discuss these updates. Oh, by the way, I’ve added Sarah from the legal team to the Slack channel so she can review the final draft before we send it over."

James: 
"Perfect. Let me know once the draft is ready. I’ll loop in the development team so they can start planning resources. Thanks, Emily!"

Emily: 
"Will do. Talk soon!"
`;


// Example usage
getCompletion(businessDiscussion);
