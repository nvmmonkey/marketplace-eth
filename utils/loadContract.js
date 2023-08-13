import contract from "@truffle/contract";

export const loadContract = async (name, provider) => {
  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  const _contract = contract(Artifact);
  _contract.setProvider(provider);

  let deployContract = null;
  try {
    deployContract = await _contract.deployed();
  } catch (error) {
    console.log(`Contract ${name} cannot be loaded!`);
  }

  return deployContract;
};
