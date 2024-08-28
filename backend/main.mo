import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Result "mo:base/Result";

actor {
  // Types
  type Model = {
    id: Text;
    name: Text;
    description: Text;
  };

  type ModelDetails = {
    description: Text;
    parameters: Parameters;
  };

  type Parameters = {
    temperature: Float;
    maxTokens: Nat;
  };

  // Stable variables
  stable var modelsArray: [Model] = [
    { id = "model1"; name = "GPT-3"; description = "OpenAI's GPT-3 model" },
    { id = "model2"; name = "BERT"; description = "Google's BERT model" },
  ];

  let modelDetails = HashMap.HashMap<Text, ModelDetails>(10, Text.equal, Text.hash);

  // Initialize model details
  modelDetails.put("model1", { description = "A powerful language model"; parameters = { temperature = 0.7; maxTokens = 100 } });
  modelDetails.put("model2", { description = "An efficient NLP model"; parameters = { temperature = 0.5; maxTokens = 50 } });

  // Public functions
  public query func getModels() : async [Model] {
    modelsArray
  };

  public query func getModelDetails(modelId: Text) : async Result.Result<ModelDetails, Text> {
    switch (modelDetails.get(modelId)) {
      case (null) { #err("Model not found") };
      case (?details) { #ok(details) };
    }
  };

  public func generateText(modelId: Text, prompt: Text, params: ?Parameters) : async Result.Result<Text, Text> {
    switch (modelDetails.get(modelId)) {
      case (null) { #err("Model not found") };
      case (?details) {
        let temperature = switch (params) {
          case (null) { details.parameters.temperature };
          case (?p) { p.temperature };
        };
        let maxTokens = switch (params) {
          case (null) { details.parameters.maxTokens };
          case (?p) { p.maxTokens };
        };
        // Simulate text generation
        let generatedText = prompt # " (Generated with temp: " # Float.toText(temperature) # ", max tokens: " # Nat.toText(maxTokens) # ")";
        #ok(generatedText)
      };
    }
  };
}
