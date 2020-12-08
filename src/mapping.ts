import { BigInt } from "@graphprotocol/graph-ts"
import {
  OrionToken,
  MinterAdded,
  MinterRemoved,
  Transfer,
  Approval
} from "../generated/OrionToken/OrionToken"
import {TokenHolder, Minter, TokenHolderCounter, MinterCounter, TransferCounter, TokenApprove } from "../generated/schema"

export function handleMinterAdded(event: MinterAdded): void {
  let minter = Minter.load(event.address.toHex())
  if (minter == null) {
    // Minter added
    minter = new Minter(event.address.toHex())
    minter.address = event.address.toHex()
    minter.count = BigInt.fromI32(1)
  }
  minter.count = minter.count.plus(BigInt.fromI32(1))
  minter.save()
}

export function handleMinterRemoved(event: MinterRemoved): void {
  let minter = Minter.load(event.address.toHex())
  if (minter == null) {
    // Minter removed
    minter = new Minter(event.address.toHex())
    minter.address = event.address.toHex()
    minter.count = BigInt.fromI32(1)
  }  
  minter.count = minter.count.plus(BigInt.fromI32(1))
  minter.save()
}

export function handleTransfer(event: Transfer): void {
  let tokenholderFrom = TokenHolder.load(event.params.from.toHex())
  if (tokenholderFrom == null) {
    tokenholderFrom = newTokenHolder(event.params.from.toHex(), event.params.from.toHex());
    tokenholderFrom.count = BigInt.fromI32(1)
  }
  tokenholderFrom.balance = tokenholderFrom.balance.minus(event.params.value)
  tokenholderFrom.transactionCount = tokenholderFrom.transactionCount.plus(BigInt.fromI32(1))
  tokenholderFrom.count = tokenholderFrom.count.plus(BigInt.fromI32(1))
  tokenholderFrom.save()

  let tokenholderTo = TokenHolder.load(event.params.to.toHex())
  if (tokenholderTo == null) {
    tokenholderTo = newTokenHolder(event.params.to.toHex(), event.params.to.toHex());
    tokenholderTo.count = BigInt.fromI32(1)
  }
    // TokenHolderCounter
      //let tokenholderCounter = TokenHolderCounter.load('singleton')
      //if (tokenholderCounter == null) {
        //tokenholderCounter = new TokenHolderCounter('singleton')
        //tokenholderCounter.count = BigInt.fromI32(1)
       //else {
        //tokenholderCounter.count = tokenholderCounter.count.plus(BigInt.fromI32(1))
      //}
      //tokenholderCounter.save()
      //tokenholderCounter.save()
  tokenholderTo.balance = tokenholderTo.balance.plus(event.params.value)
  tokenholderTo.transactionCount = tokenholderTo.transactionCount.plus(BigInt.fromI32(1))
  tokenholderTo.count = tokenholderTo.count.plus(BigInt.fromI32(1))
  tokenholderTo.save()

  // Transfer counter total and historical
  let transferCounter = TransferCounter.load('singleton')
  if (transferCounter == null) {
    transferCounter = new TransferCounter('singleton')
    transferCounter.count = BigInt.fromI32(0)
    transferCounter.totalTransferred = BigInt.fromI32(0)
  }
  transferCounter.count = transferCounter.count.plus(BigInt.fromI32(1))
  transferCounter.totalTransferred = transferCounter.totalTransferred.plus(event.params.value)
  transferCounter.save()  
}

export function handleApproval(event: Approval): void {
  let tokenapprove = TokenApprove.load(event.transaction.from.toHex())
if (tokenapprove == null) {
tokenapprove = new TokenApprove(event.transaction.from.toHex())
tokenapprove.count = BigInt.fromI32(0)
}
tokenapprove.count = event.transaction.value
tokenapprove.owner = event.params.owner
tokenapprove.spender = event.params.spender
tokenapprove.save()
}

function newTokenHolder(id: string, address: string): TokenHolder {
  let tokenholder = new TokenHolder(id);
  tokenholder.address = address
  tokenholder.balance = BigInt.fromI32(0)
  tokenholder.transactionCount = BigInt.fromI32(0)
  return tokenholder
}