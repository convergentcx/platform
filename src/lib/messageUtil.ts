export enum MessageType {
  Bought = "Bought",
  Contributed = "Contributed",
  MetadataUpdated = "MetadataUpdated",
  ServiceRequested = "ServiceRequested",
  Sold = "Sold",
};

interface BoughtValues {
  buyer: string,  // indexed
  amount: string,
  paid: string,
};

interface ContributedValues {
  buyer: string,
  contribution: string,
};

interface MetadataUpdatedValues {
  newMetadata: string,
};

interface ServiceRequestedValues {
  requestor: string,  // indexed
  serviceIndex: string,
  message: string,
};

interface SoldValues {
  seller: string,
  amount: string,
  reserveReturned: string,
};

type Event = {
  event: string,
  blockNumber: string,
  returnValues: {},
};

const tryThrowaway = (val: any) => {
  if (!parseInt(val) && parseInt(val) !== 0) {
    return val;
  }
}

// Takes an array of event objects
// const sortMessages = (messages: Event[]): any[] => {
//   const sorted = messages.map((msg: Event) => {
//     const { event, blockNumber, returnValues } = msg;
//     switch (event) {
//       case MessageType.Bought:
//         const rValues = Object.keys(returnValues);
//         const elements = rValues.map((val: any) => {
//           if (!!tryThrowaway(val)) {

//           }
//         })
//     }
//   })
// };











export const test = 'test';
