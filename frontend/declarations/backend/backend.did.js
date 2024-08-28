export const idlFactory = ({ IDL }) => {
  const Parameters = IDL.Record({
    'temperature' : IDL.Float64,
    'maxTokens' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const ModelDetails = IDL.Record({
    'parameters' : Parameters,
    'description' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : ModelDetails, 'err' : IDL.Text });
  const Model = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  return IDL.Service({
    'generateText' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(Parameters)],
        [Result_1],
        [],
      ),
    'getModelDetails' : IDL.Func([IDL.Text], [Result], ['query']),
    'getModels' : IDL.Func([], [IDL.Vec(Model)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
