# NFT Placeholder Generator

This is a sample project that generates junk placeholder images and metadata for playing with NFT contracts on a test net. Images are generated at 512x512, but they really don't need to be. They are a solid color, which substantially reduces the compressed jpeg footprint. A folder of 100 images is <1MB.

# Installing

There is no npm module at this time. To install:

- pull or download master branch from git.
- `npm i -g ./`

# Configuring

At this moment, the only things that are readily configurable are the metadata template, found in `metadata-template.json` and the attributes in `attributes.json`.

Attributes are simply an array of traits with equal-weight options that will be drawn at random. They are immaterial, as this is just placeholder junk.

# Running

- See 'Installing' to install
- run `placeholder-gen images -s 1 -e 100 /path/to/ImagesOutDir`
- optionally, upload these to ipfs or arweave as desired, and update the `metadata-template.json` with the ipfs / arweave base url for your placeholder art.
- run `placeholder-gen metadata -s 1 -e 100 /path/to/MetadataOutDir`
- optionally, upload these to ipfs or arweave as desired
- optionally, point your testnet contract at the uploaded metadata
