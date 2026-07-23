using OpenAI;
using OpenAI.Chat;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class GroqService
{
    private readonly ChatClient _chatClient;

    public GroqService(IConfiguration configuration)
    {
        var apiKey = configuration["GroqSettings:ApiKey"];
        var model = configuration["GroqSettings:Model"] ?? "llama-3.3-70b-versatile";

        var options = new OpenAIClientOptions
        {
            Endpoint = new Uri("https://api.groq.com/openai/v1")
        };
        var openAIClient = new OpenAIClient(new System.ClientModel.ApiKeyCredential(apiKey), options);
        _chatClient = openAIClient.GetChatClient(model);
    }

    public async Task<string> GetSkincareRecommendationAsync(string systemPrompt, string userJsonData)
    {
        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(systemPrompt),
            new UserChatMessage(userJsonData)
        };

        var options = new ChatCompletionOptions
        {
            ResponseFormat = ChatResponseFormat.CreateJsonObjectFormat(), // sadece json verisi dön
            Temperature = 0.2f 
        };

        // İstek atıyoruz
        ChatCompletion completion = await _chatClient.CompleteChatAsync(messages, options);
        
        return completion.Content[0].Text;
    }
}