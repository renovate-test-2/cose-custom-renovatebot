/*!
 * Copyright 2021 - MATTR Limited
 * All rights reserved
 * Confidential and proprietary
 */

import { Buffer } from "buffer";
import { CoseSignatureAlgorithmEnum } from "./iana";
import { CoseHeaders } from "./CoseHeaders";
import { SignerFunction } from "./SignerFunction";
import { JsonWebKeyPrivateValidator, JsonWebKeyPrivate } from "./JsonWebKey";
import { z } from "zod";
import { assertType, isType } from "./common";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @ignore
 */
export interface SingleSignOptions {
  /**
   * Algorithm
   */
  readonly algorithm: number;
  /**
   * An array of protected headers to include in the signed structure
   */
  readonly protectedHeaders?: CoseHeaders;
  /**
   * An array of unprotected headers to include in the signed structure
   */
  readonly unprotectedHeaders?: CoseHeaders;
  /**
   * Additional authenticated data
   */
  readonly additionalAuthenticatedData?: any;
  /**
   * Payload to be signed
   */
  readonly payload: any;
  /**
   * Indicates whether to skip CBOR encoding the payload (only allowed in the type of the supplied payload
   * is binary)
   */
  readonly skipEncodingPayload?: boolean;
  /**
   * Indicates whether to tag the resulting output with a CBOR tag structure
   */
  readonly skipTag?: boolean;
  /**
   * Function for handling the cryptographic signing operation
   *
   * Note - either this parameter or the *key* parameter MUST be present
   */
  readonly externalSigner?: SignerFunction;
  /**
   * Private key used to perform cryptographic signing operation
   *
   * Note - either this parameter or the *signer* parameter MUST be present
   */
  readonly privateKey?: JsonWebKeyPrivate;
}

/**
 * @ignore
 */
export const SingleSignOptionsValidator = z.object({
  algorithm: z.nativeEnum(CoseSignatureAlgorithmEnum),
  protectedHeaders: z.object({}).optional(),
  unprotectedHeaders: z.object({}).optional(),
  additionalAuthenticatedData: z.object({}).optional(),
  payload: z.union([
    z.instanceof(Uint8Array),
    z.instanceof(Buffer),
    z.object({}),
    z.string(),
    z.number(),
    z.any().array(),
    z.boolean(),
    z.number(),
    z.map(z.any(), z.any()),
  ]),
  skipEncodingPayload: z.boolean().optional(),
  skipTag: z.boolean().optional(),
  externalSigner: z.function().optional(),
  privateKey: z.optional(JsonWebKeyPrivateValidator),
});

/**
 * @ignore
 */
export const isSingleSignOptions = isType<SingleSignOptions>(SingleSignOptionsValidator);

/**
 * @ignore
 */
export const assertSingleSignOptions = assertType<SingleSignOptions>(
  SingleSignOptionsValidator,
  "Expected SingleSignOptions"
);
