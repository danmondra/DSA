export function resolve (specifier, context, nextResolve) {
  if (specifier.endsWith('.js')) {
    const tsSpecifier = specifier.replace(/\.js$/, '.ts')

    return nextResolve(tsSpecifier, context)
  }

  return nextResolve(specifier, context)
}
