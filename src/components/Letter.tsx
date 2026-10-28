import { LETTER, STAMPS } from '../content/circus'
import { useProgress } from '../lib/progress'
import { Icon } from './Icons'
import { SectionHeading, StampBadge } from './UI'

export function Letter() {
  const { allStamps, totalStamps } = useProgress()

  return (
    <section className="section letter-section" id="carta" aria-labelledby="carta-title">
      <SectionHeading
        kicker="Acto cuarto · La carta"
        title="Una carta sin sobre cerrado"
        lede="No hay que conseguir nada para leerla. Está aquí desde el principio, como las cosas que importan."
        id="carta-title"
      />

      <div className="letter-stage">
        <div className="letter-envelope" aria-hidden="true">
          <span className="letter-flap" />
          <span className="letter-seal"><Icon name="heart" size={22} /></span>
          <span className="letter-stamp">27<span>·</span>10<span>·</span>24</span>
        </div>

        <article className="letter-paper">
          <header className="letter-head">
            <p className="eyebrow">Correspondencia privada · {totalStamps}/{STAMPS.length} sellos</p>
            <h3 className="display letter-to">{LETTER.greeting}</h3>
          </header>
          <div className="letter-body">
            {LETTER.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <p className="hand letter-signature">Eddy</p>
          <div className="letter-ps">
            {allStamps ? (
              <p className="hand"><Icon name="key" size={16} /> {LETTER.ps}</p>
            ) : (
              <p className="letter-locked">
                <Icon name="lock" size={15} />
                Hay una posdata escondida. Consigue los {STAMPS.length} sellos para leerla.
              </p>
            )}
          </div>
          <footer className="letter-foot">
            <span>{STAMPS.length} sellos · una función privada</span>
            <StampBadge tone={allStamps ? 'gold' : 'violet'} locked={!allStamps}>
              {allStamps ? 'Pasaporte completo' : 'Sigue la función'}
            </StampBadge>
          </footer>
        </article>

        <div className="letter-margin" aria-hidden="true">
          <span>Para Gappy,</span>
          <span>con todo el confeti.</span>
          <Icon name="sparkle" size={22} />
        </div>
      </div>
    </section>
  )
}
