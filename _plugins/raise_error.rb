# Custom Liquid tag to fail the Jekyll build with an error message.
# Usage: {% raise_error "Landing project has no link" %}
module Jekyll
  class RaiseErrorTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @message = text.strip
    end

    def render(context)
      # Interpolate any Liquid variables in the message
      rendered = Liquid::Template.parse(@message).render(context)
      raise rendered
    end
  end
end

Liquid::Template.register_tag('raise_error', Jekyll::RaiseErrorTag)
