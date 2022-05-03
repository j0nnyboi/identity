#![deny(missing_docs)]
#![forbid(unsafe_code)]
#![feature(trivial_bounds)]

//! An Identity program for Solana

pub mod error;
pub mod instruction;
pub mod processor;
pub mod state;

#[cfg(not(feature = "no-entrypoint"))]
mod entrypoint;

// Export current sdk types for downstream users building with a different sdk version
pub use safecoin_program;

safecoin_program::declare_id!("5Te4gVFNuKPZD4vqSoyJZ9fQD9ehXczYzUjKkPJ6ma1Q");
